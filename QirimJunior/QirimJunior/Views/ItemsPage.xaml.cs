using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using QirimJunior.Models;
using QirimJunior.Views;
using QirimJunior.ViewModels;

namespace QirimJunior.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ItemsPage : ContentPage
    {
        void Handle_Clicked(object sender, System.EventArgs e)
        {
            pnFilter.IsVisible = !pnFilter.IsVisible;
        }

        async void Delete_Clicked(object sender, System.EventArgs e)
        {
            var answer = await DisplayAlert("Are you sure?", "Delete item", "Yes", "No");
            if (answer)
            {
                //await _vm.DeleteHistory();
                // await viewModel.DeletePoem();
            }
        }

        ItemsViewModel viewModel;

        public ItemsPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new ItemsViewModel(Navigation);
        }

        internal void UpdateContext()
        {
            Task.Run(() => viewModel.ExecuteLoadItemsCommand());
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (viewModel.Poems.Count == 0)
                viewModel.LoadItemsCommand.Execute(null);
        }
    }
}