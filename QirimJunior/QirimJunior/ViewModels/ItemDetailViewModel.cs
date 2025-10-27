using System;
using System.Threading.Tasks;
using QirimJunior.Models;
using QirimJunior.Views;
using Rg.Plugins.Popup.Services;
using Xamarin.Forms;

namespace QirimJunior.ViewModels
{
    public class ItemDetailViewModel : BaseViewModel
    {
        public PoemModel Item { get; set; }
        public string Poem { get; set; }

        public Command TapCommand { get; set; }
        private PopupPage _popup = new PopupPage();
        public ItemDetailViewModel(PoemModel item, string title, string poem)
        {
            Title = title;
            Item = item;
            Poem = poem;
            TapCommand = new Command(async p => await OnTapped(p.ToString()));
        }

        async Task OnTapped(string image)
        {
            _popup.UpdateImage(image);
            await PopupNavigation.Instance.PushAsync(_popup);
        }
    }
}
