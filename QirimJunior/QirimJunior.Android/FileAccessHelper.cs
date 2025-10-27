using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Android.App;
using Newtonsoft.Json;
using QirimJunior.Models;

namespace QirimJunior.Droid
{
    public class FileAccessHelper
    {
        public static string GetLocalFilePath(string filename)
        {
            string path = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            string dbPath = Path.Combine(path, filename);

            return dbPath;
        }

        public async static Task LoadDatabase()
        {
            using (var br = new StreamReader(Application.Context.Assets.Open("poems.json")))
            {
                var file = br.ReadToEnd();
                var poems = JsonConvert.DeserializeObject<List<PoemModel>>(file);
                await App.Database.UpdateDbAsync(poems, true);
            }
        }
    }
}