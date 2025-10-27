using System;
using System.Collections.Generic;
using System.Text;

namespace QirimJunior.ViewModels
{
    public class PopupPageVM : BaseViewModel
    {
        public string _imageUrl;
        public string ImageUrl
        {
            get { return _imageUrl; }
            set { SetProperty(ref _imageUrl, value); }
        }


        public void UpdateImage(string img)
        {
            ImageUrl = img;
        }
    }
}
