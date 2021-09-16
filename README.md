# Microfrontends with React

> Build incredibly scalable apps with a microfrontend architecture

## 01 The Basics of Microfrontends

![001](/images/001.png)

What are microfrontends?

- Divide a monolithic app into multiple, smaller apps
- Each smaller app is responsible for a distinct feature of the product

Why use them?

- Multiple engineering teams can work in isolation
- Each smaller app is easier to understand and make changes to

### Understanding Build-Time Integration

![002](/images/002.png)

![003](/images/003.png)

Integration

- There is no single perfect solution to integration
- Many solutions, each have pros and cons
- Look at what your requirements are, then pick a solution

![004](/images/004.png)

![005](/images/005.png)

![006](/images/006.png)

![007](/images/007.png)

> oh yes! 微前端的核心在于 **“Integration”**

![008](/images/008.png)

![009](/images/009.png)

### 02 The Basics of Module Federation

- Designate one app as the Host **(Container)** and one as the Remote **(Products)**
- In the Remote, decide which modules (files) you want to make available to other projects
- Set up Module Federation plugin to expose those files
- In the Host, decide which files you want to get from the remote
- Set up Module Federation plugin to fetch those files
- In the Host, refactor the entry point to load asynchronously
- In the Host, import whatever files you need from the remote

```js
module.exports = {
  mode: 'development',
  devServer: {
    port: 8080,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        products: 'products@http://localhost:8081/remoteEntry.js',
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = {
  mode: 'development',
  devServer: {
    port: 8081,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsIndex': './src/index',
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

> 不得不说，ModuleFederation 真的 🐂 🦏 🐄 🐃 🐮

![010](/images/010.png)

![011](/images/011.png)

![012](/images/012.png)

![013](/images/013.png)

![014](/images/014.png)

![015](/images/015.png)

![016](/images/016.png)

### 03 Sharing Dependencies Between Apps

#### Using Shared Modules

🚀 **需求**：在 N 个 Package 中共享一个模块，则配置 webpack 即可：

- Container fetches Products remoteEntry.js file
- Container fetches Cart remoteEntry.js file
- Container nodetices that both require Faker!
- Container can choose to load only one copy from either Cart or Products
- Single copy is made available to both Cart + Products

> 例如当前项目，我们在 products 和 cart 前端中都是用了 fake ，则我们可以将其提升一层，共享出来！
>
> 一样的，还是配置 `webpack` 的 `ModuleFederationPlugin` 即可。
>
> 配置后，两个子前端的包里就不会再压入 faker 代码了!

```js
// -> 两个子前端的配置都需要改
new ModuleFederationPlugin({
  name: 'products',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductsIndex': './src/index',
  },
  shared: ['faker'],
}),
```

- Shared Module Versioning
- Singleton Loading
- 如果开启了共享组件的版本指定后，在另一个 包 里使用其他版本组件，并设置了 shared ，则控制台会提示无法开启 `单例`
- 其实这样就可以考虑 `lerna` 做包管理器，这样也方便很多
