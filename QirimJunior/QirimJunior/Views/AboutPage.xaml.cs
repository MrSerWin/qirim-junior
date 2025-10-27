using System;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace QirimJunior.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AboutPage : ContentPage
    {
        public AboutPage()
        {
            InitializeComponent();
        }

        public void ServinTapped(object sender, EventArgs args)
        {
            Device.OpenUri(new Uri("https://www.facebook.com/servin.osmanov"));
        }

        public void AnaYurtTapped(object sender, EventArgs args)
        {
            Device.OpenUri(new Uri("https://ana-yurt.com"));
        }

        public void TitoSiteTapped(object sender, EventArgs args)
        {
            Device.OpenUri(new Uri("https://tito.site/"));
        }

        public void QirimJrFbTapped(object sender, EventArgs args)
        {
            Device.OpenUri(new Uri("https://www.facebook.com/Qirim-Junior-723563914451534/"));
        }

        public void QirimJrTapped(object sender, EventArgs args)
        {
            Device.OpenUri(new Uri("https://qirimjr.org/"));
        }
        //https://apps.apple.com/us/app/qirim-junior/id1459040436?l=ru&ls=1
    }
}