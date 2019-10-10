import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import 'bulma'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      news: null,
      error: null,
      token: '&apiKey=cbe8a4a0457e4d83bd127fd1986747d2',
      selectedCategory: 'technology',
      selectedCountry: 'gb'
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.categories = ['All', 'Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']
    this.countries = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'
  }
  componentDidMount() {
    this.getData(this.state.selectedCountry, this.state.selectedCategory,)
  }
 

  handleClick(e) {
    const selectedCategory = e.target.value.toLowerCase()
    this.setState({ selectedCategory })
    // console.log(this.state)
    this.getData(this.state.selectedCountry, selectedCategory)
  }

  handleChange(e) {
    const selectedCountry = e.target.value
    this.setState({ selectedCountry })
    this.getData(selectedCountry, this.state.selectedCategory)
    
  }

  changeValues() {
    
  }

  getData( selectedCountry, selectedCategory ) {
    axios.get(`https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=${selectedCategory}${this.state.token}`)
      // .then(res => console.log(res.data))
      .then(res => {
        console.log('got data')
        this.setState({ news: res.data })
      })
      .catch(err => console.log(err.message))
    console.log('loading', this.state.selectedCategory, this.state.selectedCountry)
  }



  retrieveSources() {
    // this.state.news.articles.map(article => (

    // ))
  }
  render() {

    console.log('rendering', this.state.selectedCategory, this.state.selectedCountry)
    console.log(this.state.news)
    return (
      <>
        <header className="navbar">
          <select onChange={this.handleChange} >
            {this.countries.split(' ').map(country => 
              <option key={country}>{country}</option>
            )}
          </select>
          <div className="buttons">
            {this.categories.map(cat => (
              <button onClick={this.handleClick} key={cat.index} value={cat}>{cat}</button>
            ))}
          </div>

        </header>
        <div className="section">

          <div className="container">
            <div className="columns is-mobile is-multiline">
              <div className="articles">
                {!this.state.news && !this.state.error && <p>Loading......</p>}
                {this.state.error && <p>Oops, something went wrong</p>}
                {this.state.news &&
                  this.state.news.articles.map(article => (
                    <div className="card" key={article.title}>
                      <div className="card-header">
                        <h1 className="card-header-title">{article.title}</h1>
                      </div>
                      <div className="card-content">
                        <h2 >{article.description}</h2>
                      </div>
                      <figure className="image">
                        <img className="card-image" src={article.urlToImage} alt='article image' />
                      </figure>
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