using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;

using Xamarin.Forms;

using QirimJunior.Models;
using QirimJunior.Views;
using QirimJunior.Services;
using System.Collections.Generic;
//using Xamarin.Forms.Extended;

namespace QirimJunior.ViewModels
{
    public class ItemsViewModel : BaseViewModel
    {
        public Command LoadItemsCommand { get; set; }
        public Command ClearCommand { get; set; }

        //private InfiniteScrollCollection<Stih> _poems = new InfiniteScrollCollection<Stih>();
        private List<PoemModel> _poems = new List<PoemModel>();
        private List<Author> _authors = new List<Author>();
        private List<Theme> _themes = new List<Theme>();
        private PoemModel _selectedPoem;
        private bool _canDelete;
        private bool _isLatin = true;
        private INavigation _navigation;
        private Theme _selectedTheme;
        private Author _selectedAuthor;
        private int PageSize = 10;

        public ItemsViewModel(INavigation navigation)
        {
            Title = "Şiirler";
            _navigation = navigation;
            LoadItemsCommand = new Command(async () => await ExecuteLoadItemsCommand());
            ClearCommand = new Command(async () => await Clear());
            // Task.Run(() => InitForm());
            InitForm();
        }

        private async Task InitForm()
        {


             await LoadPoems();
            Authors = await App.Database.GetAuthorsAsync();
            Themes = await App.Database.GetThemesAsync();
        }

        private async Task LoadPoems()
        {
            for (int i = 0; i < 10; i++)
            {
                Poems = await App.Database.GetPoemsAsync();
                if (Poems.Count == 0)
                {
                    await Task.Delay(100);
                } 
                else
                {
                    return;
                }
            }
                
            /* Poems = new List<Stih>
             {
                 OnLoadMore = async () =>
                 {
                     IsBusy = true;

                     // load the next page
                     var page = Poems.Count / PageSize;

                     var items = await App.Database.GetItemsAsync(page, PageSize);

                     IsBusy = false;

                     // return the items that need to be added
                     return items;
                 },
                 //OnCanLoadMore = () =>
                 //{
                 //    return Poems.Count < 44;
                 //}
             };*/
            // await DownloadDataAsync();
        }

        private async Task DownloadDataAsync()
        {
            var items = await App.Database.GetItemsAsync(pageIndex: 0, pageSize: PageSize+50000);

            Poems.AddRange(items);
        }

        private async Task Clear()
        {
            SelectedTheme = null;
            SelectedAuthor = null;
            IsLatin = true;
            Poems = App.Database.GetPoems();
            //await DownloadDataAsync();
        }


        public bool CanDelete
        {
            get { return _canDelete; }
            set
            {
                SetProperty(ref _canDelete, value);
            }

        }

        public List<Author> Authors
        {
            get { return _authors; }
            set 
            { 
                SetProperty(ref _authors, value);
            }

        }

        public List<Theme> Themes
        {
            get { return _themes; }
            set 
            { 
                SetProperty(ref _themes, value);
            }
        }

        public List<PoemModel> Poems
        {
            get { return _poems; }
            set { SetProperty(ref _poems, value); }
        }

        public bool IsLatin
        {
            get { return _isLatin; }
            set { SetProperty(ref _isLatin, value); }
        }

        public Author SelectedAuthor
        {
            get { return _selectedAuthor; }
            set 
            { 
                SetProperty(ref _selectedAuthor, value);
                if(value != null)
                {
                    //Poems = new InfiniteScrollCollection<Stih>(App.Database.GetPoemsByFilters(SelectedAuthor, SelectedTheme));
                    Poems = App.Database.GetPoemsByFilters(SelectedAuthor, SelectedTheme);
                }

            }
        }


        public Theme SelectedTheme
        {
            get { return _selectedTheme; }
            set 
            { 
                SetProperty(ref _selectedTheme, value);
                if (value != null)
                {
                    //Poems = new InfiniteScrollCollection<Stih>(App.Database.GetPoemsByFilters(SelectedAuthor, SelectedTheme));
                    Poems = App.Database.GetPoemsByFilters(SelectedAuthor, SelectedTheme);
                }

            }
        }


        public PoemModel SelectedPoem
        {
            get { return _selectedPoem; }
            set
            {
                SetProperty(ref _selectedPoem, value);
                if(value != null && !string.IsNullOrEmpty(value.TitleLat))
                {
                    var title = IsLatin ? SelectedPoem.TitleLat : SelectedPoem.TitleCyr;
                    var poem = IsLatin ? SelectedPoem.PoemLat : SelectedPoem.PoemCyr;
                    _navigation.PushAsync(new ItemDetailPage(new ItemDetailViewModel(value, title, poem)));
                    SelectedPoem = new PoemModel();

                }
                CanDelete = value != null;
            }
        }

        private async Task LoadData()
        {
            try
            {
                var poem = await QirimJuniorService.GetPoemsAsync();
                var authors = await QirimJuniorService.GetAuthorsAsync(poem);
                var themes = await QirimJuniorService.GetThemesAsync(poem);
                // var p = JsonConvert.SerializeObject(poem);
                await App.Database.UpdateDbAsync(poem, authors, themes);
                await InitForm();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            // UpdateContext();
        }


        public async Task DeletePoem()
        {
            try
            {
                await App.Database.DeletePoemAsync(SelectedPoem);
                await LoadData();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            // UpdateContext();
        }

        internal async Task ExecuteLoadItemsCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                /*Items.Clear();
                var items = await DataStore.GetItemsAsync(true);
                foreach (var item in items)
                {
                    Items.Add(item);
                }*/
                await LoadData();
                // await InitForm();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{ex.Message} {ex.StackTrace}");
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}