using System;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using QirimJunior.Models;
using QirimJunior.ViewModels;

namespace QirimJunior.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ItemDetailPage : ContentPage
    {
        ItemDetailViewModel viewModel;

        public ItemDetailPage(ItemDetailViewModel viewModel)
        {
            InitializeComponent();

            BindingContext = this.viewModel = viewModel;
        }
    }
}