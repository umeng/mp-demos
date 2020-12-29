let { mpxPluginConf, dllConf, supportedModes } = require('../config/index')
const MpxWebpackPlugin = require('@mpxjs/webpack-plugin')
const { resolve, resolveSrc } = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
const webpack = require('webpack')
const path = require('path')

module.exports = function getRules (options) {
  const { mode, srcMode, subDir, production, report } = options
  const plugins = []
  const copyIgnoreArr = supportedModes.map((item) => {
    return `**/${item}/**`
  })

  let currentMpxPluginConf
  if (typeof mpxPluginConf === 'function') {
    currentMpxPluginConf = mpxPluginConf(options)
  } else {
    currentMpxPluginConf = mpxPluginConf
  }

  plugins.push(new MpxWebpackPlugin(Object.assign({}, currentMpxPluginConf, {
    mode,
    srcMode
  })))
  const copyList = [
    {
      context: resolve(`static/${mode}`),
      from: '**/*',
      to: subDir ? '..' : ''
    },
    {
      context: resolve(`static`),
      from: '**/*',
      to: subDir ? '..' : '',
      globOptions: {
        ignore: copyIgnoreArr
      }
    }
  ]

  if (options.cloudFunc) {
    copyList.push({
      context: resolve(`src/functions`),
      from: '**/*',
      to: '../functions/'
    })
  }

  if (options.needDll) {
    const getDllManifests = require('./getDllManifests')
    const dllManifests = getDllManifests(production)
    const localDllManifests = dllManifests.filter((manifest) => {
      return manifest.mode === mode || !manifest.mode
    })

    localDllManifests.forEach((manifest) => {
      plugins.push(new webpack.DllReferencePlugin({
        context: dllConf.context,
        manifest: manifest.content
      }))
      copyList.push({
        context: path.join(dllConf.path, 'lib'),
        from: manifest.content.name,
        to: manifest.content.name
      })
    })
  }
  plugins.push(new CopyWebpackPlugin(copyList))

  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: production ? '"production"' : '"development"'
    }
  }))

  if (mode === 'web') {
    plugins.push(new VueLoaderPlugin())
    plugins.push(new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolveSrc('index.html', subDir),
      inject: true
    }))
  }

  if (report) {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return plugins
}
