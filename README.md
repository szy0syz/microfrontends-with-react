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
