import React from 'react'
import ReactDOM from 'react-dom'
import 'bulma'
import './style.scss'
import axios from 'axios'


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      news: { articles: [] },
      error: null,
      selectedCategory: 'technology',
      selectedCountry: 'gb',
      searchString: '',
      filteredSources: [],
      selectedSource: 'All'

    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this)
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
    const selectedSource = e.target.value
    this.setState({ selectedSource })

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
    axios.get(`https://newsapi.org/v2/everything?q=${this.state.searchString}&apikey=${this.webApiAccessToken}`)
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
        this.setState({ news: res.data }, this.retrieveSources)
        // this.retrieveSources()
      })
      .catch(err => console.log(err.message))
    // console.log('loading', this.state.selectedCategory, this.state.selectedCountry)

  }

  retrieveSources() {
    return this.state.news.articles.filter(article => {
      return article.source.name === this.state.this.state.selectedSource === 'AselectedSource || ll' 
    })
  }

  
  render() {
    
    console.log('rendering', this.state.filteredSources)
    if (!this.state.news) return null
    this.retrieveSources()
    const sources = [...new Set(this.state.news.articles.map(article => article.source.name))]
    return (
      <>
     
        <header className="navbar">
          <div className="pageTitle">
            <h1>Daily News</h1>
            <p>powered by NewsApi</p>
          </div>
          <div className="selectors">
            {/* Source filter functionality needs to be finished and implemented, currently it's not displayed with SCSS */}
            <select className="sourceSelect" onChange={this.handleSourceChange}>
              <option value="All">All</option>
              {sources.map(source =>
                <option key={source} value={source}>{source}</option>
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
                {!this.state.news && !this.state.error && <p className="warning">Loading......</p>}
                {this.state.news === [] && <p className="warning">OOPs, 0 results</p>}
                {this.state.error && <p className="warning">Oops, something went wrong</p>}
                {this.state.news &&
                
                  this.retrieveSources().map(article => (
                    <div className="card" key={article.title}>
                      <a href={article.url} target="_blank">
                        <div className="card-header">
                          <h1 className="card-header-title">{article.title}</h1>
                        </div>
                        <div className="card-content">
                          <p >{article.content}</p>
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