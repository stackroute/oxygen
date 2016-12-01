module.exports={
  entry:'./webclient/views/App.jsx',
  output:{
    path:'webclient/assets/',
    filename:'bundle.js',
    publicPath:'/assets/'
  },
  module:
  {
    loaders:[{
      loader:'babel',
      test:/\.jsx$/,
      query:{
        presets:['es2015','react','stage-1']
      }
    }]
  },
  resolve:
  {
   extensions:['','.js','.jsx','/index.js','/index','/index.jsx']
 },
 node: {
   console: true,
   fs: 'empty',
   net: 'empty'
 }
};
