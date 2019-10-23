import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma'
import './style.scss'
import axios from 'axios'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      news: null,
      error: null,
      selectedCategory: 'general',
      selectedCountry: 'gb',
      searchString: '',
      filteredSources: [],
      selectedSource: 'All'

    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']
    this.countries = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'
    this.webApiAccessToken = process.env.WEBAPI_ACCESS_TOKEN
  }
  componentDidMount() {
    this.getData(this.state.selectedCountry, this.state.selectedCategory)

  }

  handleClick(e) {
    const selectedCategory = e.target.value.toLowerCase()
    this.setState({ selectedCategory })
    this.getData(this.state.selectedCountry, selectedCategory)
  }

  handleChange(e) {
    const selectedCountry = e.target.value
    this.setState({ selectedCountry })
    this.getData(selectedCountry, this.state.selectedCategory)

  }
  handleSourceChange(e) {
    // console.log(this.state.news.articles)
    const selectedSource = e.target.value
    // const filteredArticles = this.state.news.articles.filter(article => (
    //   article.source.name === selectedSource
    // ))
    console.log(selectedSource)
  }

  handleKeyUp(e) {
    const searchString = e.target.value
    this.setState({ searchString })
    console.log(searchString)

  }

  handleSearchSubmit(e) {
    // console.log('button', this.state.searchString)
    this.performSearch()

  }

  performSearch() {
    axios.get(`https://newsapi.org/v2/everything?q=${this.state.searchString}&results=100&apikey=${this.webApiAccessToken}`)
      // .then(res => console.log(res.data))
      .then(res => {
        console.log('got data')
        this.setState({ news: res.data })
      })
      .catch(err => console.log(err.message))
  }

  getData(selectedCountry, selectedCategory) {
    console.log('filter state', this.state.filteredSources)
    axios.get(`https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=${selectedCategory}&apikey=${this.webApiAccessToken}`)
      // .then(res => console.log(res.data))
      .then(res => {
        this.setState({ news: res.data })
        this.retrieveSources()
      })
      .catch(err => console.log(err.message))

  }

  retrieveSources() {
    const sources = this.state.news.articles.map(article => article.source.name)
    const filteredSources = sources.filter((source, index) => sources.indexOf(source) === index).sort() || this.selectedSource === 'All'
    this.setState({ filteredSources })
  }

  filterArticles() {

  }
  render() {
    console.log('rendering')
    return (
      <>
        <header className="navbar">
          <div className="pageTitle">
            <h1>Daily News</h1>
            <p>powered by NewsApi.org</p>
          </div>
          <div className="selectors">
           
            <select className="sourceSelect" onChange={this.handleSourceChange}>
              <option>All</option>
              {this.state.filteredSources.map(source =>
                <option key={source}>{source}</option>
              )}
            </select>

            <div className="buttons">
              {this.categories.map(cat => (
                <button className="categoryButton" onClick={this.handleClick} key={cat} value={cat}>{cat}</button>
              ))}
            </div>
            <p>Language:</p>
            <select className="languageSelector" onChange={this.handleChange} >
              <option>{this.state.selectedCountry}</option>
              {this.countries.split(' ').map(country =>
                <option key={country}>{country}</option>
              )}
            </select>
          </div>

          <div className="searchBar">
            <input onKeyUp={this.handleKeyUp} name="searchInput" placeholder="Search..."></input>
            <button className="searchSubmit" onClick={this.handleSearchSubmit}>Search</button>
          </div>

        </header>
        <div className="section">
          <div className="container">
            <div className="columns">
              <div className="articles">
                {!this.state.news && !this.state.error && <p className="message" className="warning">Loading......</p>}
                {this.state.news === [] && <p className="warning">Oops, check your search criteria and try again </p>}
                {this.state.error && <p className="warning">Oops, something went wrong</p>}
                {this.state.news &&
                  this.state.news.articles.map(article => (
                    <div className="card" key={article.title}>
                      <a href={article.url} target="_blank">
                        <div className="card-header">
                          <h2 className="card-header-title">{article.title}</h2>
                        </div>
                        <div className="card-content">
                          <p >{article.description}</p>
                        </div>
                        <figure className="image">
                          <img className="card-image" src={article.urlToImage} alt='article image' />
                        </figure>
                      </a>
                    </div>

                  ))}

              </div>
            </div>
          </div>
        </div >

      </>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)