//
//  CallPhone.m
//  Empresas PY
//
//  Created by Paul Von Schrottky on 1/16/14.
//
//

#import "CallPhone.h"

@implementation CallPhone

- (void)callNumber:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        self.command = command;
        NSString *phoneNumber = [command.arguments objectAtIndex:0];
        NSURL *phoneURL = [NSURL URLWithString:[NSString stringWithFormat:@"telprompt:%@", phoneNumber]];
        [[UIApplication sharedApplication] openURL:phoneURL];
    }];
}

@end