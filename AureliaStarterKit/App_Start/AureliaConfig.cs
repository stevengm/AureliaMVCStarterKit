using System;
using System.Web.Optimization;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(AureliaStarterKit.App_Start.AureliaConfig), "PreStart")]

namespace AureliaStarterKit.App_Start
{
    public static class AureliaConfig
    {
        public static void PreStart()
        {
            // Add your start logic here
            AureliaBundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}