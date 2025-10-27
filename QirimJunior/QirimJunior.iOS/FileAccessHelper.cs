using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Foundation;
using Newtonsoft.Json;
using QirimJunior.Models;

namespace QirimJunior.iOS
{
    public class FileAccessHelper
    {
        public static string GetLocalFilePath(string filename)
        {
            string docFolder = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            string libFolder = Path.Combine(docFolder, "..", "Library", "Databases");

            if (!Directory.Exists(libFolder))
            {
                Directory.CreateDirectory(libFolder);
            }

            string dbPath = Path.Combine(libFolder, filename);

            return dbPath;
        }


        public async static Task LoadDatabase()
        {
            var wordsFile = NSBundle.MainBundle.PathForResource("poems", "json");

            using (var br = new StreamReader(wordsFile))
            {
                var file = await br.ReadToEndAsync();
                var poems = JsonConvert.DeserializeObject<List<PoemModel>>(file);
                await App.Database.UpdateDbAsync(poems, true);
            }
        }
    }
}

