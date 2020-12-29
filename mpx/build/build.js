const ora = require('ora')
const rm = require('rimraf')
const chalk = require('chalk')
const webpack = require('webpack')
const program = require('commander')
const { userConf, supportedModes } = require('../config/index')
const getWebpackConf = require('./getWebpackConf')
const { resolveDist } = require('./utils')

program
  .option('-w, --watch', 'watch mode')
  .option('-p, --production', 'production release')
  .parse(process.argv)

// 提供npm argv找到期望构建的平台，必须在上面支持的平台列表里
const npmConfigArgvOriginal = (process.env.npm_config_argv && JSON.parse(process.env.npm_config_argv).original) || []
const modeArr = npmConfigArgvOriginal.filter(item => typeof item === 'string').map(item => item.replace('--', '')).filter(item => supportedModes.includes(item))

// 暂时兼容npm7的写法
if (!npmConfigArgvOriginal.length) {
  const env = process.env
  supportedCrossMode.forEach(key => {
    if (env[`npm_config_${key}`] === 'true') {
      modeArr.push(key)
    }
  })
}

if (!modeArr.length) modeArr.push(userConf.srcMode)

let webpackConfs = []

modeArr.forEach((mode) => {
  const options = Object.assign({}, userConf, {
    mode,
    production: program.production,
    watch: program.watch,
    report: process.env.npm_config_report,
    subDir: (userConf.isPlugin || userConf.cloudFunc) ? 'miniprogram' : ''
  })
  webpackConfs.push(getWebpackConf(options))
})

if (userConf.isPlugin) {
  const options = Object.assign({}, userConf, {
    plugin: true,
    mode: 'wx',
    production: program.production,
    watch: program.watch,
    report: process.env.npm_config_report,
    subDir: 'plugin'
  })
  webpackConfs.push(getWebpackConf(options))
}

if (webpackConfs.length === 1) {
  webpackConfs = webpackConfs[0]
}

const spinner = ora('building...')
spinner.start()

try {
  modeArr.forEach(item => {
    rm.sync(resolveDist(item, '*'))
  })
} catch (e) {
  console.error(e)
  console.log('\n\n删除dist文件夹遇到了一些问题，如果遇到问题请手工删除dist重来\n\n')
}

if (program.watch) {
  webpack(webpackConfs).watch(undefined, callback)
} else {
  webpack(webpackConfs, callback)
}

function callback (err, stats) {
  spinner.stop()
  if (err) {
    process.exitCode = 1
    return console.error(err)
  }
  if (Array.isArray(stats.stats)) {
    stats.stats.forEach(item => {
      console.log(item.compilation.name + '打包结果：')
      process.stdout.write(item.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        entrypoints: false
      }) + '\n\n')
    })
  } else {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      entrypoints: false
    }) + '\n\n')
  }

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
  } else if (program.watch) {
    console.log(chalk.cyan(`  Build complete at ${new Date()}.\n  Still watching...\n`))
  } else {
    console.log(chalk.cyan('  Build complete.\n'))
  }
}
