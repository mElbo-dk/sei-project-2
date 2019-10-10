import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      news: null,
      error: null,
      token: '&apiKey=cbe8a4a0457e4d83bd127fd1986747d2'
    }
  }
  componentDidMount() {
    axios.get(`https://newsapi.org/v2/top-headlines?country=no&category=technology${this.state.token}`)
      // .then(res => console.log(res.data))
      .then(res => this.setState({ news: res.data }))
      .catch(err => console.log(err.message))
  }

  render() {
    console.log('state is', this.state.news)
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-mobile is-multiline">
            {!this.state.news && !this.state.error && <p>Loading......</p>}
            {this.state.error && <p>Oops, something went wrong</p>}
            {this.state.news &&
              this.state.news.articles.map(article => (
                <div key={article.title}>
                  <h1>{article.title}</h1>
                </div>
              ))}

          </div>
        </div>
      </section >
    )

  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)