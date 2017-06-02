//
//  ViewController.m
//  WebViewDemo
//
//  Created by SourceFreeze on 02/07/14.
//  Copyright (c) 2014 Test. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
   //Do any additional setup after loading the view, typically from a nib.
    NSString *urlString = @"https://team-labyoke.herokuapp.com/login";
    NSURL *url = [NSURL URLWithString:urlString];
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:url];
    [_webView loadRequest:urlRequest];
 
    /* load local html file
    NSString *localURL = [NSBundle pathForResource:@"index" ofType:@"html" inDirectory:nil];
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:[NSURL fileURLWithPath:localURL]];
    [_webView loadRequest:urlRequest];
    */
    
}


/* for run this delete above viewDidload method remove this comment.
// ******** Create UIWebView Programmatically ********
- (void)viewDidLoad
{
    [super viewDidLoad];
	  Do any additional setup after loading the view, typically from a nib.
    UIWebView *webView = [[UIWebView alloc]init];
    NSString *urlString = @"http://www.sourcefreeze.com";
    NSURL *url = [NSURL URLWithString:urlString];
    NSURLRequest *urlRequest = [NSURLRequest requestWithURL:url];
    [webView loadRequest:urlRequest];
   [self.view addSubview:webView];
 
}
*/

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
