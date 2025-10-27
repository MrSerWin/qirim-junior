using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using QirimJunior.Views;
using QirimJunior.Services;
using System.Threading.Tasks;
using Rg.Plugins.Popup.Services;
using Newtonsoft.Json;
using System.Collections.Generic;
using QirimJunior.Models;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]
namespace QirimJunior
{
    public partial class App : Application
    {
        static DAL database;
        private object _popup;

        internal bool IsLatView { get; set; } = true;
        public App(string dbPath)
        {
            InitializeComponent();
            //set database path first, then retrieve main page
            database = new DAL(dbPath);
            MainPage = new MainPage();

        }

        private async Task LoadData()
        {
            var poem = await QirimJuniorService.GetPoemsAsync();
            var authors = await QirimJuniorService.GetAuthorsAsync(poem);
            var themes = await QirimJuniorService.GetThemesAsync(poem);
            await Database.UpdateDbAsync(poem, authors, themes);
            UpdateContext();
        }

        private void UpdateContext()
        {
            try
            {
                var tab = (TabbedPage)App.Current.MainPage;
                var navigation = (NavigationPage)(tab.CurrentPage);
                var page = (navigation).RootPage;
                if (page != null)
                {
                    if (page is ItemsPage)
                    {
                        ((ItemsPage)page).UpdateContext();
                    }
                }
            }
            catch (Exception ex) {
                var er = ex.Message;
            }
        }

        public static DAL Database
        {
            get
            {
                return database ?? new DAL();
            }
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
