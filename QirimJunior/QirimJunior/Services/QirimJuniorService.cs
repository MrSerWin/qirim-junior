using Newtonsoft.Json;
using QirimJunior.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace QirimJunior.Services
{
    internal static class QirimJuniorService
    {
        internal static async Task<List<PoemModel>> GetPoemsAsync()
        {
            var url = $"{CommonSettings.HOST}/api/?action=poems";
        //    var res1 = JsonConvert.DeserializeObject<CustomResponseModel>(await GetAsync(url));
         //   var poems1 = ConvertToPoems(res1.data);
          //  var json = JsonConvert.SerializeObject(poems1);
            //return poems;
            var res = JsonConvert.DeserializeObject<CustomStihModel>(await GetAsync(url));
            //var json = JsonConvert.SerializeObject(res);
            return res.data;
        }

        private static string GetSql(List<PoemModel> poems)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("INSERT INTO `poems`(`TitleCyr`, `PoemCyr`, `TitleLat`, `PoemLat`, `Author`, `Theme`, `Image`, `IsNeedToBeAdded`) VALUES");

            foreach (var poem in poems)
            {
                sb.AppendLine($"('{poem.TitleCyr}', '{poem.PoemCyr}', '{poem.TitleLat}', '{poem.PoemLat}', '{poem.Author}', '{poem.Theme}', " +
                    $"'{poem.Image}', 0),");
            }
            return sb.ToString();
        }

        internal static Task<List<string>> GetAuthorsAsync(List<PoemModel> poems)
        {
            return Task.Run(() => GetAuthors(poems));
        }

        internal static List<string> GetAuthors(List<PoemModel> poems)
        {
            var authors = new List<string>();
            foreach (var p in poems)
            {
                if(!authors.Contains(p.Author))
                {
                    authors.Add(p.Author);
                }
            }
            return authors;
        }

        internal static Task<List<string>> GetThemesAsync(List<PoemModel> poems)
        {
            return Task.Run(() => GetThemes(poems));
        }

        internal static List<string> GetThemes(List<PoemModel> poems)
        {
            var themes = new List<string>();
            foreach (var p in poems)
            {
                if (!themes.Contains(p.Theme))
                {
                    themes.Add(p.Theme);
                }
            }
            return themes;
        }

        private static List<PoemModel> ConvertToPoems(List<ResponseModel> data)
        {
            var poems = new List<PoemModel>();
            var poemdGroup = data.GroupBy(r => r.SubmissionId).ToList();
            int count = 1;
            foreach (var group in poemdGroup)
            {
                var stih = new PoemModel();
                foreach (var item in group)
                {
                    switch(item.FieldName)
                    {
                        case "autor":
                            stih.Author = item.FieldValue;
                            break;
                        case "attach":
                            stih.Image = item.FieldValue.Replace("/home/b/bahrayqp/qirimjr.org/public_html", CommonSettings.HOST);
                            break;
                        case "FullName":
                            stih.TitleCyr = item.FieldValue;
                            break;
                        case "text":
                            stih.PoemCyr = item.FieldValue;
                            break;
                        case "FullName copy":
                            stih.TitleLat = item.FieldValue;
                            break;
                        case "text copy":
                            stih.PoemLat = item.FieldValue;
                            break;
                        case "CompanySize": // theme
                            stih.Theme = item.FieldValue;
                            break;

                    }
                }
                stih.id = count++;
                stih.UniqId = Guid.NewGuid().ToString();
                poems.Add(stih);
            }
            return poems;
        }

        private static async Task<string> GetAsync(string uri)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync())
            {
                using (Stream stream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        var res = await reader.ReadToEndAsync();
                        return res;
                    }
                }
            }
        }
    }

    internal class CustomResponseModel
    {
        public List<ResponseModel> data { get; set; }
    }

    internal class CustomStihModel
    {
        public List<PoemModel> data { get; set; }
    }
}
