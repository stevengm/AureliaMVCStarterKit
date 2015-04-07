using System;
using System.Web.Optimization;

namespace AureliaStarterKit
{
    public class AureliaBundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/Scripts/vendor")
                 .Include("~/jspm_packages/system.js")
                 .Include("~/Scripts/ConfigFiles/config.js")
              );

            bundles.Add(
              new StyleBundle("~/Content/css")
                .Include("~/jspm_packages/npm/font-awesome@4.3.0/css/font-awesome.min.css")
                .Include("~/Content/styles.css")
              );
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}