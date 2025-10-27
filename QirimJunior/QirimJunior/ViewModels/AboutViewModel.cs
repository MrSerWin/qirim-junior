using System;
using System.Windows.Input;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace QirimJunior.ViewModels
{
    public class AboutViewModel : BaseViewModel
    {
        private string _appVersion;
        private string _appName;
        public AboutViewModel()
        {
            Title = "Biz Içün";

            try
            {
                AppName = AppInfo.Name;
                AppVersion = AppInfo.VersionString;
            }
            catch { }
        }


        public string AppVersion
        {
            get => _appVersion;
            set => SetProperty(ref _appVersion, value);
        }

        public string AppName
        {
            get => _appName;
            set => SetProperty(ref _appName, value);
        }

    }
}