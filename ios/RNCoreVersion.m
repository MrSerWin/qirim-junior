#import "RNCoreVersion.h"

@implementation RNCoreVersion

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  NSString *appVersion = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
  NSString *buildNumber = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"];

  return @{
    @"appVersion": appVersion ?: @"2.0.0",
    @"buildNumber": buildNumber ?: @"2"
  };
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
