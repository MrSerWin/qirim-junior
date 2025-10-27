using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using SQLite;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using QirimJunior.Models;
using System.Diagnostics;

namespace QirimJunior.Services
{
    public class DAL
    {
        private const int DB_VERSION = 8;
        private string DB_PATH;

        readonly SQLiteConnection database;

        public DAL(string dbPath)
        {
            //initialize a new SQLiteConnection 
            if (database == null)
            {
                database = new SQLiteConnection(dbPath, false);
                DB_PATH = dbPath;
            }
        }

        public DAL()
        {
            //initialize a new SQLiteConnection 
            if (database == null)
            {
                database = new SQLiteConnection(DB_PATH, false);
            }
        }

        public async Task UpdateDbAsync(List<PoemModel> poem, bool forseUpdate = false)
        {
            var authors = poem.Select(p => p.Author).Distinct().ToList();
            var themes = poem.Select(p => p.Theme).Distinct().ToList();
            await UpdateDbAsync(poem, authors, themes, forseUpdate);
        }

        internal async Task UpdateDbAsync(List<PoemModel> poem, List<string> authors, List<string> themes, bool forseUpdate = false)
        {
            await Task.Run(() => UpdateDb(poem, authors, themes, forseUpdate));
        }

        internal void UpdateDb(List<PoemModel> poem, List<string> authors, List<string> themes, bool forseUpdate = false)
        {
            UpdatePoems(poem, forseUpdate);
            UpdateAuthors(authors);
            UpdateThemes(themes);
        }

        internal List<string> GetAuthorsNames()
        {
            return GetAuthors().Select(a => a.Name).ToList();
        }


        internal List<PoemModel> GetPoemsByFilters(Author author, Theme theme)
        {
            if (author != null && theme != null)
            {
                return GetPoems().Where(a => a.Author.Equals(author.Name) && a.Theme.Equals(theme.Name)).ToList();
            }
            else if (author == null && theme != null)
            {
                return GetPoems().Where(a => a.Theme.Equals(theme.Name)).ToList();
            }
            else if (author != null && theme == null)
            {
                return GetPoems().Where(a => a.Author.Equals(author.Name)).ToList();
            }
            else
                return GetPoems();
        }

        internal async Task<List<Author>> GetAuthorsAsync()
        {
            return await Task.Run(() => GetAuthors());
        }
        internal List<Author> GetAuthors()
        {
            var lst = new List<Author>();
            try
            {
                lst = database.Table<Author>().ToList();
            }
            catch (Exception ex)
            {
                CreateTable<Author>();
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            return lst;
        }


        internal List<string> GetThemesNames()
        {
            return GetThemes().Select(a => a.Name).ToList();
        }

        internal async Task<List<Theme>> GetThemesAsync()
        {
            return await Task.Run(() => GetThemes());
        }

        internal List<Theme> GetThemes()
        {
            var lst = new List<Theme>();
            try
            {
                lst = database.Table<Theme>().ToList();
            }
            catch (Exception ex)
            {
                CreateTable<Theme>();
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            return lst;
        }

        public async Task<List<PoemModel>> GetItemsAsync(int pageIndex, int pageSize)
        {
            await Task.Delay(2000);
            var poems = await GetPoemsAsync();
            return poems.Skip(pageIndex * pageSize).Take(pageSize).ToList();
        }

        internal async Task<List<PoemModel>> GetPoemsAsync()
        {
            return await Task.Run(() => GetPoems());
        }
        internal List<PoemModel> GetPoems()
        {
            var lst = new List<PoemModel>();
            try
            {
                lst = database.Table<PoemModel>().ToList().OrderByDescending(p => p.UpdatedAt).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                CreateTable<PoemModel>();
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            return lst;
        }

        private void UpdateAuthors(List<string> authors)
        {
            var authorsList = GetAuthors();
            var names = authorsList.Select(a => a.Name);
            foreach (var author in authors)
            {
                if (!names.Contains(author))
                {
                    database.Insert(new Author() { Name = author });
                }
            }
        }

        private void UpdateThemes(List<string> themes)
        {
            var themesList = GetThemes();
            var themeNames = themesList.Select(a => a.Name);
            foreach (var theme in themes)
            {
                if (!themeNames.Contains(theme))
                {
                    database.Insert(new Theme() { Name = theme });
                }
            }
        }

        private void UpdatePoems(List<PoemModel> poems, bool forseUpdate = false)
        {
            var poemsList = GetPoems();
            var pLocal = poemsList.Select(p => $"{p.UniqId}").ToList();
            foreach (var p in poems)
            {
                if(!pLocal.Contains($"{p.UniqId}"))
                {
                    if ((!p.IsDeleted && p.IsNeedToBeAdded) || forseUpdate)
                        database.Insert(p);
                }
                else
                {
                    PoemModel poem = GetLocalPoem(poemsList, p);
                    if (p.IsDeleted)
                    {
                        DeletePoem(poem);
                    }
                    else
                    {
                        // update all fileds
                        UpdatePoem(poem, p);
                    }
                }
            }
        }

        private void UpdatePoem(PoemModel poem, PoemModel targetPoem, bool forseUpdate = false)
        {
            if(targetPoem.UpdatedAt > poem.UpdatedAt || forseUpdate)
            {
                poem.id = targetPoem.id;
                poem.Image = targetPoem.Image;
                poem.TitleLat = targetPoem.TitleLat;
                poem.PoemLat = targetPoem.PoemLat;
                poem.UpdatedAt = targetPoem.UpdatedAt;
                poem.TitleCyr = targetPoem.TitleCyr;
                poem.PoemCyr = targetPoem.PoemCyr;
                poem.Author = targetPoem.Author;
                poem.Theme = targetPoem.Theme;
                poem.IsDeleted = targetPoem.IsDeleted;
                poem.IsNeedToBeAdded = targetPoem.IsNeedToBeAdded;
                UpdatePoem(poem);
            }
        }

        private void UpdatePoem(PoemModel poem)
        {
            database.Update(poem);
        }

        private PoemModel GetLocalPoem(List<PoemModel> poemsList, PoemModel poem)
        {
            var poems = poemsList.Where(p => p.UniqId == poem.UniqId).ToList();
            var result = poems.FirstOrDefault();
            if(poems.Count > 1)
            {
                poems.Remove(result);
                DeleteRedundantPoems(poems);
            }
            return result;
        }

        private void DeleteRedundantPoems(List<PoemModel> poemsList)
        {
            foreach (var poem in poemsList)
            {
                DeletePoem(poem);
            }
        }
        private void DeletePoem(PoemModel poem)
        {
            database.Delete(poem);
        }

        public void DropTables()
        {
            // clear table
            try { database.DropTable<PoemModel>(); } catch { }
            try { database.DropTable<Author>(); } catch { }
            try { database.DropTable<Theme>(); } catch { }
        }

        public void CreateTables()
        {
            //add table
            var res = CreateTable<PoemModel>();
            var res1 = CreateTable<Author>();
            var res2 = CreateTable<Theme>();
        }

        internal Task DeletePoemAsync(PoemModel selectedPoem)
        {
            throw new NotImplementedException();
        }

        internal async Task<int> DeleteHistoryAsync(PoemModel selectedPoem)
        {
            return await Task.Run(() => DeleteHistory(selectedPoem));
        }

        internal int DeleteHistory(PoemModel selectedPoem)
        {
            try
            {
                return database.Delete(selectedPoem);
            }
            catch { return 0; }
        }

        private CreateTableResult CreateTable<T>()
        {
            try { return database.CreateTable<T>(); }
            catch { return CreateTableResult.Migrated; }
        }



        public void InitDB()
        {
            /*if (set != null)
            {
                settings.datetime = DateTime.Now;
                return database.Update(settings);
            }
            else
            {
                return database.Insert(settings);
            }*/
        }

        public bool IsDbVersionActual()
        {
            try
            {
                var stih = database.Table<PoemModel>().ToList();

                return stih.Count > 0;
            }
            catch { return false; }
        }
    }
}
