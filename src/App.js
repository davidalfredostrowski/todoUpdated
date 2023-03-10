import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import TodoList from './TodoList'

class App extends Component {
	componentWillMount(){
		this.loadBlockchainData()
	}


	async loadBlockchainData(){

	//const wb3 = new Web3(Web3.givenProvider || "http://ec2... does not work")
        const web3 = new Web3( "http://ec2-35-84-186-78.us-west-2.compute.amazonaws.com:8545")	
        const networkId = await web3.eth.net.getId();
	const network = await web3.eth.net.getNetworkType()
	console.log( "network:", network)
	const accounts = await web3.eth.getAccounts()
	console.log("account", accounts[0])
	this.setState({ account: accounts[0] })	
	var config  = require('./TodoList.json');   // put a copy in /src directory.....
        let jsonData = require('./TodoList.json');
        var networkKey =  Object.keys(jsonData['networks'])[Object.keys(jsonData.networks).length-1] 
        const contract = new web3.eth.Contract(jsonData.abi);

        contract.options.address = jsonData['networks'][networkId]["address"]
	//let ans = await contract.methods.createTask("junk").send({ from: accounts[0] })i.once('receipt', (receipt) => { this.setState({ loading: false })})

	this.setState({ contract }) 

	const taskCount = await contract.methods.taskCount().call()
	this.setState( {taskCount}) 
	for (var i = 1;i <= taskCount; i++){
		const task = await contract.methods.tasks(i).call()
		this.setState({
			tasks: [...this.state.tasks,task]
		})
	}
	}
        constructor(props){
	  	super(props)
	  	this.state = {account: '',
		taskCount: 0,
		tasks: []
	}
 
    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)



  }

state = { visible: true
};


  createTask(content) {
    this.setState({ loading: true })
    this.state.contract.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.contract.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

	render() {
		return ( 
      <div>
       My todo list

        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </div>
		);
	}
}

export default App;
