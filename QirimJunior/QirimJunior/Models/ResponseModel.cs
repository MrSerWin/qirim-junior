using Newtonsoft.Json;
using QirimJunior.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace QirimJunior.Models
{
    internal class ResponseModel : BaseViewModel
    {
        private string _SubmissionValueId;
        private string _FormId;
        private string _SubmissionId;
        private string _FieldName;
        private string _FieldValue;
        /*
        SubmissionValueId
        FormId
        SubmissionId
        FieldName
        FieldValue
             */

        [JsonProperty("SubmissionValueId")]
        public string SubmissionValueId
        {
            get { return _SubmissionValueId; }
            set { SetProperty(ref _SubmissionValueId, value); }
        }

        [JsonProperty("FormId")]
        public string FormId
        {
            get { return _FormId; }
            set { SetProperty(ref _FormId, value); }
        }

        [JsonProperty("SubmissionId")]
        public string SubmissionId
        {
            get { return _SubmissionId; }
            set { SetProperty(ref _SubmissionId, value); }
        }

        [JsonProperty("FieldName")]
        public string FieldName
        {
            get { return _FieldName; }
            set { SetProperty(ref _FieldName, value); }
        }

        [JsonProperty("FieldValue")]
        public string FieldValue
        {
            get { return _FieldValue; }
            set { SetProperty(ref _FieldValue, value); }
        }
    }
}
