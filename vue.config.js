module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: '8080',
        https: false,
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}