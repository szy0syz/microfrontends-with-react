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

但这样改了以后有个问题：我们的 `faker` 已不再当前 `子前端` 的 `bundle` 里了，直接访问项目就会出现这样问题：

```bash
main.js:829 Uncaught Error: Shared module is not available for eager consumption: webpack/sharing/consume/default/faker/faker
    at Object.__webpack_modules__.<computed> (main.js:829)
    at __webpack_require__ (main.js:487)
    at eval (index.js:2)
    at Module../src/index.js (main.js:464)
    at __webpack_require__ (main.js:487)
```

> 那改怎么办呢？ 解决方案在下方 ↓ ↓ ↓

#### Async Script Loading

> 那就把子前端异步加载，这样他就能 import 共享地拿到当前自己所身在容器内的 package 代码了！
>
> index.js + bootstrap.js = 👍

```js
import('./bootstrap');
```

- Shared Module Versioning
- Singleton Loading
- 如果开启了共享组件的版本指定后，在另一个 包 里使用其他版本组件，并设置了 shared ，则控制台会提示无法开启 `单例`
- 其实这样就可以考虑 `lerna` 做包管理器，这样也方便很多

```js
new ModuleFederationPlugin({
  name: 'products',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductsIndex': './src/index',
  },
  shared: [{
    faker: {
      singleton: true
    }
  }],
}),
```

### Sub-App Execution Context

```js
// Context/Situation #1
// We are running this file in development in isolation
// We are using our local index.html file
// Which DEFNITELY has an element with an id of 'dev-products
// We want to immediately render our app into that element
if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#dev-products');

  // Assuming our container doesnt have an element
  // with id 'dev-products'....
  if (el) {
    // We are probably running in isolation
    mount(el);
  }
}

// Context/Situation #2
// We are running this file in develpment or production
// through the CONTAINER app
// NO GUARANTEE that an element with an id of 'dev-products' exists
// WE DO NOT WANT try to immediately render the app
export { mount };
```

我们有这么这个需求：

- 在开发环境，直接访问项目地址可以独立渲染
- 但生产环境，我们只导出挂载函数，又容器本身确定渲染到哪里

### 04 Linking Multiple Apps Together

![017](/images/017.png)

![018](/images/018.png)

Huge Disclaimer

- Some blog posts, articles, videos, etc will tell you todo things differently
- The architecture for this project is determined by its requirements
- You need to think about the rquirements of your app to decide if this architecture will work for you

![019](/images/019.png)
