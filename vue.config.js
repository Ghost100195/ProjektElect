module.exports = {
  pluginOptions: {
    electronBuilder: {
      buildVersion: "0.0.2",
      appId: "com.example.enviroment",
      productName: "RuntimeEnviroment" ,
      copyright: "Copyright © year L.Roessig",
      remoteBuild: true,
      builderOptions: {
        linux: {
          target: "AppImage",
          executableName: "linuxExe"
        },
        win: {
          target: "portable"
        },
        mac: {
          category: "public.app-category.developer-tools",
          target: "dmg"
        }
      }
    }
  }
}