var Container = React.createClass({
	getInitialState: function() {
    	return {
    		currentStep: 0,
    		acctOwnerInfo: {},
    		instructionsInfo: [],
    		signatureInfo: {},
    		validationInfo: {}
    	};
  	},
  	commitAccountOwnerState: function(info){
  		this.setState({acctOwnerInfo: {
  			fName: info.fName, mName: info.mName, lName: info.lName,
    		additionalName: info.additionalName, phone: info.phone, extension: info.extension,
    		isUpdatingPhone: info.isUpdatingPhone, aN1: info.aN1, aN2: info.aN2, aN3: info.aN3
  		}});
  	},
  	commitInstructionState: function(state, replaceIndex){
  		var newState = this.state.instructionsInfo.slice();

  		if (replaceIndex >= 0){
  			newState[replaceIndex] = state;
  		} else {
  			newState.push(state);
  		}

  		this.setState({instructionsInfo: newState});
  	},
  	commitSignatureState: function(state){
  		this.setState({signatureInfo: {
  			signatureCount: state.signatureCount,
  			signatures: state.signatures,
  			dates: state.dates
  		}});
  	},
  	validateStates: function(){
  		// This is where actual validation of the forms would occur
  		return true;
  	},
  	handleNavArrowClicked: function(isLeft){
  		var step = this.state.currentStep;
  		if (isLeft && step > 0){
  			step--;
  		} else if (!isLeft && step < this.props.maxStep){
  			step++;
  		}

  		this.setState({currentStep: step});
  	},
	render: function() {
	    return (
	      <div className="container">
	        <header>
	        	<div className="logo">
	        		Bananadyne Corp.
	        	</div>
	        	<div className="title">Standing Payment Instructions</div>
	        </header>
	        <ProgressBox step={this.state.currentStep}/>
	      	<ContentArea step={this.state.currentStep}
	      		commitAcctOwnerState={this.commitAccountOwnerState}
	      		acctOwnerInfo={this.state.acctOwnerInfo}
	      		commitInstructionState={this.commitInstructionState}
	      		instructionsInfo={this.state.instructionsInfo}
	      		commitSignatureState={this.commitSignatureState}
	      		signatureInfo={this.state.signatureInfo}
	      		validateStates={this.validateStates}
	      		validationInfo={this.state.validationInfo}
	      		navHandler={this.handleNavArrowClicked} />
	      </div>
	    );
	}
});

var ProgressBox = React.createClass({
	getCircleXs: function(startX, endX, numCircles) {
		var l = endX - startX;
		var stride = l / (numCircles - 1);

		var xs = [];
		var prevX = 0;
		for (var i = 0; i < numCircles; i++){
			if (i == 0){
				xs[i] = startX;
				prevX = startX;
				continue;
			}
			
			xs[i] = prevX + stride;
			prevX += stride;
		}

		return xs;
	},
	getLabel: function(){
		var l;
		switch (this.props.step){
			case 0:
				l = "Account Owner(s)";
				break;
			case 1:
				l = "Add/Change Instruction(s)";
				break;
			case 2:
				l = "Signatures and Dates";
				break;
			case 3:
				l = "Verify and Submit";
				break;
			default:
				l = "";
		}

		return l;
	},
  	render: function() {
  		var xs = this.getCircleXs(60, 510, 4);
  		var l = this.getLabel();
  		var count = 0;
  		var id;
  		var circleNodes = xs.map(function(x){
  			id = this.props.step == count ? "P-current-circle" : "P-circle";
  			return (
  				<circle key={count++} cx={x} cy="15" r="12" id={id} />
  			)
  		}, this);

	    return (
	      <nav className="progressBox">
	        <svg id="Progress" width="600" height="50">
	        	<line x1="60" y1="15" x2="510" y2="15" id="P-line" />
	        	{circleNodes}
	        	<text x={xs[this.props.step] - 50} y="45" 
	        		fontFamily="Helvetica" fontSize="16">{l}</text>
	        </svg>

	      </nav>
	    );
  }
});

var ContentArea = React.createClass({
  render: function() {
    return (
      <div className="contentArea">
        <EntryContainerA info={this.props.acctOwnerInfo} 
  									committer={this.props.commitAcctOwnerState}
  									navHandler={this.props.navHandler}
  									stepNum={0} currentStep={this.props.step} />
  		<EntryContainerB info={this.props.instructionsInfo} 
  									committer={this.props.commitInstructionState}
  									navHandler={this.props.navHandler}
  									stepNum={1} currentStep={this.props.step} />
  		<EntryContainerC info={this.props.signatureInfo} 
  									committer={this.props.commitSignatureState}
  									navHandler={this.props.navHandler} 
  									stepNum={2} currentStep={this.props.step} />
  		<EntryContainerD info={this.props.validationInfo}
  									validator={this.props.validateStates}
  									navHandler={this.props.navHandler}
  									stepNum={3} currentStep={this.props.step} />					
      </div>
    );
  }
});

var EntryContainerA = React.createClass({
	getInitialState: function() {
    	return {
    		fName: "", mName: "", lName: "",
    		additionalName: "", phone: "", extension: "",
    		isUpdatingPhone: false, aN1: "", aN2: "", aN3: ""
    	};
  	},
  	componentWillReceiveProps: function(nextProps){
  		if (this.props.stepNum == this.props.currentStep
  			&& this.props.currentStep != nextProps.currentStep){
  			this.props.committer(this.state);
  		}
  		else if (this.props.stepNum != this.props.currentStep
  			&& this.props.stepNum == nextProps.currentStep){
  			this.applyState(nextProps.info);
  		}
  	},
  	applyState: function(info){
  		this.setState({
  			fName: info.fName, mName: info.mName, lName: info.lName,
    		additionalName: info.additionalName, phone: info.phone, extension: info.extension,
    		isUpdatingPhone: info.isUpdatingPhone, aN1: info.aN1, aN2: info.aN2, aN3: info.aN3
  		});
  	},
  	handleChange: function(event){
  		var newState = {};
  		newState[event.target.id] = event.target.value;
  		
  		this.setState(newState);
  	},
	render: function() {
		var visible = this.props.currentStep == this.props.stepNum;
		var fName = this.state.fName;
		var mName = this.state.mName;
	    return (
	      <div className="entryContainerA" style={{display: visible ? "" : "none"}}>
	      	<section className="information">
	      		Use this form to establish or change standing Check Disbursement, Bank Wire, and/or Electronic Funds Transfer (“EFT”)
	      		instructions on your brokerage account, including eligible retirement and nonretirement accounts 
	      		(“Fidelity Brokerage Accounts”). 
	      		<br /> <br />
	      		Asset Movement Authorization (granted via the new account application or a 
	      		separate form) may be required for your Authorized agent/Advisor to use these standing instructions on your behalf.
	      	</section>
	      	<section className="normal">
		      	<div className="entry-line">
		      		<div className="entry-info">
		      			Provide all information requested.
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="fName"> First Name </label>
		      			<input className="ti" type="text" id="fName" value={this.state.fName} onChange={this.handleChange}/>
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="mName"> M.I. </label>
		      			<input className="ti-small" type="text" id="mName" value={this.state.mName} onChange={this.handleChange}/> 
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="lName"> Last Name </label>
		      			<input className="ti" type="text" id="lName" value={this.state.lName} onChange={this.handleChange}/>
		      		</div>
		      	</div>
		      	<div className="entry-line">
		      		<div className="entry-info">

		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="additionalName"> Additional Owner, Company or Trust Name <i> if applicable </i> </label>
		      			<input className="ti-large" type="text" id="additionalName" value={this.state.additionalName} onChange={this.handleChange}/>
		      		</div>
		      	</div>
		      	<div className="entry-line">
		      		<div className="entry-info">
		      			Contact info used if there is a question about this request.
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="phone"> Daytime Phone </label>
		      			<input className="ti" type="text" id="phone" value={this.state.phone} onChange={this.handleChange}/>
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="extension"> Extension </label>
		      			<input className="ti-medium" type="text" id="extension" value={this.state.extension} onChange={this.handleChange}/>
		      		</div>
		      		<form className="hc">
		      			<input type="checkbox" id="isUpdatingPhone"
		      				onChange={this.handleChange} checked={this.state.isUpdatingPhone} />
		      			<label className="hrel" htmlFor="isUpdatingPhone"> Update account to use this number. </label>
		      		</form>
		      	</div>
		      	<div className="entry-line">
		      		<div className="entry-info">
		      			List the accounts you want standing instructions applied to.
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="aN1"> Account Number </label>
		      			<input className="ti" type="text" id="aN1" value={this.state.aN1} onChange={this.handleChange}/>
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="aN2"> Account Number </label>
		      			<input className="ti" type="text" id="aN2" value={this.state.aN2} onChange={this.handleChange}/>
		      		</div>
		      		<div className="entry">
		      			<label className="el" htmlFor="aN3"> Account Number </label>
		      			<input className="ti" type="text" id="aN3" value={this.state.aN3} onChange={this.handleChange}/>
		      		</div>
	      		</div>
	      	</section>
	      	<NavControls leftEnabled={false} rightEnabled={true} navHandler={this.props.navHandler} />
	      </div>
	    );
	}
});

var EntryContainerB = React.createClass({
	getInitialState: function() {
    	return {
    		creatingInstruction: false,
    		bank: false,
    		selectedIndex: -1,
    		editInfo: {}
    	};
  	},
  	handleCreateClick: function(isBank) {
  		if (this.state.creatingInstruction){
  			return;
  		}
  		
  		this.setState({creatingInstruction: true, bank: isBank})
  	},
  	handleItemClicked: function(itemIndex) {
  		if (this.state.creatingInstruction){
  			return;
  		}

  		this.setState({selectedIndex: itemIndex, creatingInstruction: true, 
  			bank: this.props.info[itemIndex].isBank, editInfo: this.props.info[itemIndex]});
  	},
  	handleDialogButtonClick: function(isCancel, dialogState, editing){
  		if (!isCancel){
  			// Add new instruction based off dialogState
  			this.props.committer(dialogState, (editing ? this.state.selectedIndex : -1));
  		}

  		this.setState({creatingInstruction: false, selectedIndex: -1});
  	},
  	componentWillReceiveProps: function(nextProps){
  		if (this.props.stepNum == this.props.currentStep
  			&& this.props.currentStep != nextProps.currentStep){
  			//this.props.committer(this.state);
  		}
  		else if (this.props.stepNum != this.props.currentStep
  			&& this.props.stepNum == nextProps.currentStep){
  			//this.applyState(nextProps.info);
  		}
  	},
  	applyState: function(info){
  		this.setState({
  			
  		});
  	},
  	handleChange: function(event){
  		var newState = {};
  		newState[event.target.id] = event.target.value;
  		
  		this.setState(newState);
  	},
  	render: function() {
  		var visible = this.props.currentStep == this.props.stepNum;
	    return (
	      <div className="entryContainerB" style={{display: visible ? "" : "none"}}>
	      	<div className="vert-info">
		      	<section className="information">
		      		Here are the current Standing Instructions to be submitted with this form.
		      		You can add more using the buttons and edit previously created ones by clicking
		      		on them in the list to the right.
		      	</section>
		      	<section className="information">
		      		<div style={{display: (this.state.bank && this.state.creatingInstruction) ? "" : "none"}}>
			      		<b>Bank Standing Instructions</b> allow you to move money between your brokerage account 
			      		and a bank account via Bank Wire (processed via the Federal Reserve System), or EFT 
			      		(processed via the Automated Clearing House “ACH”). <b>Bank Wire:</b> Once Bank Wire standing 
			      		instructions are established, Bank Wire requests are typically processed on the same business day.
			      		Your Broker/Dealer and/or your bank may charge a fee for a Bank Wire. Transactions may be routed 
			      		through a different intermediary bank. <b>EFT:</b> It may take 7-10 business days to establish EFT standing 
			      		instructions and 2-3 business days after the date a request is processed (disbursement or receipt) 
			      		for funds to reach the bank or brokerage account. EFT receipts are available for 1st Party EFT only.
		      		</div>
		      		<div style={{display: (!this.state.bank && this.state.creatingInstruction) ? "" : "none"}}>
		      			<b>Check Disbursement Standing Instructions</b> allow you to request that a check be paid and mailed to the name(s) 
		      			and address on record or to an alternate payee and/or alternate address listed below.
		      		</div>
		      	</section>
		    </div>
	      	<section className="instlist">
		        <InstructionsList info={this.props.info} selected={this.state.selectedIndex} 
		        	clickHandler={this.handleItemClicked} />

		        <div>
			        <CreateInstructionButton bank={true} clickHandler={this.handleCreateClick} />
					<CreateInstructionButton bank={false} clickHandler={this.handleCreateClick} />
				</div>
			</section>
			
			<CreateInstructionDialog visible={this.state.creatingInstruction} bank={this.state.bank}
				clickHandler={this.handleDialogButtonClick} isEditing={this.state.selectedIndex != -1} editInfo={this.state.editInfo} />
			
			<NavControls leftEnabled={true} rightEnabled={true} navHandler={this.props.navHandler} />
	      </div>
	    );
  }
});

var EntryContainerC = React.createClass({
	getInitialState: function() {
    	return {
    		signatureCount: 4,
    		signatures: ["","","",""],
    		dates: ["","","",""]
    	};
  	},
  	componentWillReceiveProps: function(nextProps){
  		if (this.props.stepNum == this.props.currentStep
  			&& this.props.currentStep != nextProps.currentStep){
  			this.props.committer(this.state);
  		}
  		else if (this.props.stepNum != this.props.currentStep
  			&& this.props.stepNum == nextProps.currentStep){
  			this.applyState(nextProps.info);
  		}
  	},
  	applyState: function(info){
  		if (!info.signatures) {
  			return;
  		}
  		this.setState({
  			signatureCount: info.signatureCount,
  			signatures: info.signatures,
  			dates: info.dates
  		});
  	},
  	handleChange: function(event){
  		var type = event.target.id.substring(0, 3);
  		var idx = parseInt(event.target.id.substring(3));
  		var arr;
  		var newState = {};

  		if (type == "sig"){
  			arr = this.state.signatures.slice();
  			arr[idx] = event.target.value;
  			newState["signatures"] = arr;
  		} else if (type == "dat"){
  			arr = this.state.dates.slice();
  			arr[idx] = event.target.value;
  			newState["dates"] = arr;
  		} else {
  			return;
  		}
  		
  		this.setState(newState);
  	},
  render: function() {
  	var count = 0;
  	var idx;
 	var idSig;
 	var idDate;
  	var signatureNodes = this.state.signatures.map(function(name){
  		idSig = "sig" + count;
  		idDate = "dat" + count;
  		idx = count;
  		return (
  			<div key={count++} className="entry-line">
	      		<div className="entry">
	      			<label className="el" htmlFor={idSig}> Signature </label>
	      			<input className="ti" type="text" id={idSig} value={this.state.signatures[idx]} onChange={this.handleChange}/>
	      		</div>
	      		<div className="entry">
	      			<label className="el" htmlFor={idDate}> Date (MM-DD-YY) </label>
	      			<input className="ti" type="text" id={idDate} value={this.state.dates[idx]} onChange={this.handleChange}/> 
	      		</div>
	      	</div>
  		);
  	}, this);

  	var visible = this.props.currentStep == this.props.stepNum;
    return (
      <div className="entryContainerC" style={{display: visible ? "" : "none"}}>
      	<section className="information">
      		An account owner or trustee for each account must sign below. 
      		For business accounts, an authorized individual signature is required.
      	</section>
      	<section className="normal">
	      	{signatureNodes}
	    </section>
        <NavControls leftEnabled={true} rightEnabled={true} navHandler={this.props.navHandler} />
      </div>
    );
  }
});

var EntryContainerD = React.createClass({
	getInitialState: function() {
    	return {
    		validated: false,
    		submitted: false
    	};
  	},
  	handleVerifyClicked: function() {
  		var result = this.props.validator();
  		this.setState({validated: result});
	},
	handleSubmitClicked: function() {
		if (!this.state.validated){
			return;
		}
  		this.setState({submitted: true});
	},
  	render: function() {
  		var visible = this.props.currentStep == this.props.stepNum;
    	return (
      		<div className="entryContainerD" style={{display: visible ? "" : "none"}}>
      			<section className="information">
		      		Almost done! Just click the Verify button to check all forms are correct,
		      		fix any issues, and submit.
		      	</section>
		      	<section className="relative">
		      		<div className="entry-line">
		      			<input className="vsb" type="button" value="Verify Information" onClick={this.handleVerifyClicked} />
		      			<div style={{display: this.state.validated ? "" : "none"}}>
		      				<div className="vali">
		      					Verification Complete!
		      				</div>
		      			</div>
		      		</div>
		      		<div className="entry-line" />
		      		<div className="entry-line">
		      			<div style={{display: this.state.submitted ? "" : "none"}} >
		      				<div className="vali">
		      					Submitted!!
		      				</div>
		      			</div>
		      		</div>
		      		<div className="btm-rt">
		      			<input className="vsb" type="submit" value="Submit" disabled={!this.state.validated} onClick={this.handleSubmitClicked} />
		      		</div>
			        
			    </section>
		        <NavControls leftEnabled={true} rightEnabled={false} navHandler={this.props.navHandler} />
	    	</div>
		);
  	}
});

var InstructionsList = React.createClass({
	render: function() {
		var idx = 0;
		var noItems = this.props.info.length == 0;
		var listNodes = this.props.info.map(function(item){
			return (
				<ListEntry info={item} clickHandler={this.props.clickHandler} idx={idx} key={idx++} />
			);
		}, this);

		return (
			<ul className="instructionsList">
				<div style={{display: noItems ? "" : "none"}}>
					No instructions added.
				</div>
				{listNodes}
			</ul>
		);
	}
});

var ListEntry = React.createClass({
	handleClick: function() {
		this.props.clickHandler(this.props.idx);
	},
	render: function(){
		var t1 = this.props.info.isBank ? "Bank" : "Check";
		var t2 = this.props.info.isChanging ? "Change" : "New Instruction";
		return (
			<li className="listEntry" onClick={this.handleClick}>
				Type: {t1} Action: {t2}
			</li>
		);
	}
});

var CreateInstructionButton = React.createClass({
	handleClick: function(){
		this.props.clickHandler(this.props.bank);
	},
	render: function(){
		var text = this.props.bank ? "New Bank Standing Instruction" : "New Check Disbursement Standing Instructions";

		return (
			<div className="createInstructionButton" style={{display: "inline-block"}}>
				<input className="inst" type="button" onClick={this.handleClick} value={text} />
			</div>
		);
	}
});

var CreateInstructionDialog = React.createClass({
	render: function(){
		var entry = this.props.bank ? <BankInstructionEntry clickHandler={this.props.clickHandler} editing={this.props.isEditing} editInfo={this.props.editInfo} />
		 : <CheckInstructionEntry clickHandler={this.props.clickHandler} editing={this.props.isEditing} editInfo={this.props.editInfo}/>;

		return (
			<div className="createInstructionDialog"
				 style={{display: this.props.visible ? "" : "none"}}>
				{this.props.visible ? entry : ""}
			</div>
		);
	}
});

var BankInstructionEntry = React.createClass({
	getInitialState: function() {
    	return {
    		isChanging: false, isNew: true,
    		lineNumber: "",
    		isWire: true, isEFT: false,
    		isThirdParty: false, isFirstParty: true,
    		isChecking: true, isSavings: false,
    		routingNumA: "",
    		routingNumB: "",
    		bankName: "",
    		fcaNum: "",
    		fcaName: "",
    		bankAcctNum: "",
    		acctOwner: "",
    		details: "",
    		swiftCode: "",
    		destCountry: "",
    		isBank: true
    	};
  	},
  	componentWillReceiveProps: function(nextProps){
  		if (nextProps.editing && nextProps.editInfo){
  			this.applyState(nextProps.editInfo);
  		} else {
  			this.applyState(this.getInitialState());
  		}
  	},
  	componentDidMount: function(){
  		if (this.props.editing && this.props.editInfo){
  			this.applyState(this.props.editInfo);
  		}
  	},
	buttonClickHandler: function(isCancel){
		this.props.clickHandler(isCancel, this.state, this.props.editing);
	},
	applyState: function(info){
  		this.setState({
  			isChanging: info.isChanging, isNew: info.isNew,
    		lineNumber: info.lineNumber,
    		isWire: info.isWire, isEFT: info.isEFT,
    		isThirdParty: info.isThirdParty, isFirstParty: info.isFirstParty,
    		isChecking: info.isChecking, isSavings: info.isSavings,
    		routingNumA: info.routingNumA,
    		routingNumB: info.routingNumB,
    		bankName: info.bankName,
    		fcaNum: info.fcaNum,
    		fcaName: info.fcaName,
    		bankAcctNum: info.bankAcctNum,
    		acctOwner: info.acctOwner,
    		details: info.details,
    		swiftCode: info.swiftCode,
    		destCountry: info.destCountry
  		});
  	},
	handleChange: function(event){
  		var newState = {};
  		var newOn;
  		var newOff;
  		if (event.target.id == "isChanging") {
  			newOn = event.target.id;
  			newOff = "isNew";
  		} else if (event.target.id == "isNew") {
  			newOn = event.target.id;
  			newOff = "isChanging";
  		} else if (event.target.id == "isWire") {
  			newOn = event.target.id;
  			newOff = "isEFT";
  		} else if (event.target.id == "isEFT") {
  			newOn = event.target.id;
  			newOff = "isWire";
  		} else if (event.target.id == "isThirdParty") {
  			newOn = event.target.id;
  			newOff = "isFirstParty";
  		} else if (event.target.id == "isFirstParty") {
  			newOn = event.target.id;
  			newOff = "isThirdParty";
  		} else if (event.target.id == "isChecking") {
  			newOn = event.target.id;
  			newOff = "isSavings";
  		} else if (event.target.id == "isSavings") {
  			newOn = event.target.id;
  			newOff = "isChecking";
  		}

  		if (newOn && newOff){
  			newState[newOn] = true;
  			newState[newOff] = false;
  		} else {
  			newState[event.target.id] = event.target.value;
  		}
  		
  		this.setState(newState);
  	},
	render: function(){
		var isWire = this.state.isWire;
		var rnLabelA = isWire ? "ABA" : "Bank Routing Number";
		var rnLabelB = isWire ? "Bank Routing Number" : "ABA";

		return (
			<div className="bankInstructionEntry" style={{position: "relative"}}>
				<section className="dialog">
			      	<div className="entry-line-med">
			      		<div className="entry-info">

		      			</div>
			      		<form className="vert">
			      			<div className="vert-labels">
			      				<input className="ri" type="radio" id="isNew" name="instType" 
			      					onChange={this.handleChange} checked={this.state.isNew}/>
			      				<input className="ri" type="radio" id="isChanging" name="instType" 
			      					onChange={this.handleChange} checked={this.state.isChanging} />
			      			</div>	
			      		</form>
			      		<div className="vert-labels">
			      			<label className="bel" htmlFor="isNew"> Establish New Instructions </label>
			      			<label className="bel" htmlFor="isChanging"> Change Existing Instructions </label>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="lineNumber"> Line # </label>
			      			<input className="ti" type="text" id="lineNumber" value={this.state.lineNumber} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-small">
			      		<div className="entry-info">

		      			</div>
			      		<form className="hori">
			      			<input type="radio" id="isWire" name="transferType" 
			      				onChange={this.handleChange} checked={this.state.isWire} />
			      			<label className="hrel" htmlFor="isWire"> Bank Wire </label>
			      			<input type="radio" id="isEFT" name="transferType" 
			      				onChange={this.handleChange} checked={this.state.isEFT} />
			      			<label className="hrel" htmlFor="isEFT"> EFT </label>
			      		</form>
			      	</div>
			      	<div className="entry-line-small">
			      		<div className="entry-info">

		      			</div>
			      		<form className="hori">
			      			<input type="radio" id="isFirstParty" name="partyType" 
			      				onChange={this.handleChange} checked={this.state.isFirstParty} />
			      			<label className="hrel" htmlFor="isFirstParty"> 1st Party </label>
			      			<input type="radio" id="isThirdParty" name="partyType" 
			      				onChange={this.handleChange} checked={this.state.isThirdParty} />
			      			<label className="hrel" htmlFor="isThirdParty"> 3rd Party </label>
			      		</form>
			      	</div>
		      		<div className="entry-line-small">
		      			<div className="entry-info">

		      			</div>
			      		<form className="hori">
			      			<input type="radio" id="isChecking" name="accountType" 
			      				onChange={this.handleChange} checked={this.state.isChecking} />
			      			<label className="hrel" htmlFor="isChecking"> Checking </label>
			      			<input type="radio" id="isSavings" name="accountType" 
			      				onChange={this.handleChange} checked={this.state.isSavings} />
			      			<label className="hrel" htmlFor="isSavings"> Savings </label>
			      		</form>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry-info">

		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="routingNumA"> {rnLabelA} </label>
			      			<input className="ti" type="text" id="routingNumA" value={this.state.routingNumA} onChange={this.handleChange}/>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="routingNumB"> {rnLabelB} </label>
			      			<input className="ti" type="text" id="routingNumB" value={this.state.routingNumB} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry-info">

		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="bankName"> Bank Name </label>
			      			<input className="ti-large" type="text" id="bankName" value={this.state.bankName} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med" style={{display: isWire ? "" : "none"}}>
			      		<div className="entry-info">
			      			Use for wiring through an intermediary bank.
		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="fcaNum"> Further Credit Account Number </label>
			      			<input className="ti" type="text" id="fcaNum" value={this.state.fcaNum} onChange={this.handleChange}/>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="fcaName"> Further Credit Account Name </label>
			      			<input className="ti" type="text" id="fcaName" value={this.state.fcaName} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry-info">

		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="bankAcctNum"> Bank Account Number </label>
			      			<input className="ti" type="text" id="bankAcctNum" value={this.state.bankAcctNum} onChange={this.handleChange}/>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="acctOwner"> Owner Name </label>
			      			<input className="ti" type="text" id="acctOwner" value={this.state.acctOwner} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="entry-line-med" style={{display: isWire ? "" : "none"}}>
			      		<div className="entry-info">
			      			Additional message to receiving bank.
		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="details"> Details </label>
			      			<input className="ti-large" type="text" id="details" value={this.state.details} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med" style={{display: isWire ? "" : "none"}}>
			      		<div className="entry-info">
			      			<b> Required </b> if the bank account is <b>outside</b> the U.S.
		      			</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="swiftCode"> SWIFT Code </label>
			      			<input className="ti" type="text" id="swiftCode" value={this.state.swiftCode} onChange={this.handleChange}/>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="destCountry"> Destination Country </label>
			      			<input className="ti" type="text" id="destCountry" value={this.state.destCountry} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="btm-rt">
				      	<InstructionEntryButton cancel={true} editing={this.props.editing} clickHandler={this.buttonClickHandler} />
						<InstructionEntryButton cancel={false} editing={this.props.editing} clickHandler={this.buttonClickHandler} />
					</div>
				</section>
				
			</div>
		);
	}
});

var CheckInstructionEntry = React.createClass({
	getInitialState: function() {
    	return {
    		isChanging: false, isNew: true,
    		lineNumber: "",
    		isThirdParty: false, isFirstParty: true,
    		payee: "",
    		prefixIsAttn: false, 
    		attnMessage: "",
    		address: "",
    		city: "",
    		state: "",
    		zip: "",
    		memo: "",
    		stubInfo: "",
    		notPrintingAddress: false,
    		escheatmentState: "",
    		isBank: false
    	};
  	},
  	componentWillReceiveProps: function(nextProps){
  		if (nextProps.editing && nextProps.editInfo){
  			this.applyState(nextProps.editInfo);
  		} else {
  			this.applyState(this.getInitialState());
  		}
  	},
  	componentDidMount: function(){
  		if (this.props.editing && this.props.editInfo){
  			this.applyState(this.props.editInfo);
  		}
  	},
	buttonClickHandler: function(isCancel){
		this.props.clickHandler(isCancel, this.state);
	},
	handleChange: function(event){
  		var newState = {};
  		var newOn;
  		var newOff;
  		if (event.target.id == "isChanging") {
  			newOn = event.target.id;
  			newOff = "isNew";
  		} else if (event.target.id == "isNew") {
  			newOn = event.target.id;
  			newOff = "isChanging";
  		} else if (event.target.id == "isThirdParty") {
  			newOn = event.target.id;
  			newOff = "isFirstParty";
  		} else if (event.target.id == "isFirstParty") {
  			newOn = event.target.id;
  			newOff = "isThirdParty";
  		}

  		if (newOn && newOff){
  			newState[newOn] = true;
  			newState[newOff] = false;
  		} else {
  			newState[event.target.id] = event.target.value;
  		}
  		
  		this.setState(newState);
  	},
  	applyState: function(info){
  		this.setState({
  			isChanging: info.isChecking, isNew: info.isNew,
    		lineNumber: info.lineNumber,
    		isThirdParty: info.isThirdParty, isFirstParty: info.isFirstParty,
    		payee: info.payee,
    		prefixIsAttn: info.prefixIsAttn, 
    		attnMessage: info.attnMessage,
    		address: info.address,
    		city: info.city,
    		state: info.state,
    		zip: info.zip,
    		memo: info.memo,
    		stubInfo: info.stubInfo,
    		notPrintingAddress: info.notPrintingAddress,
    		escheatmentState: info.escheatmentState,
    		isBank: info.isBank
  		});
  	},
	render: function(){
		return (
			<div className="checkInstructionEntry" style={{position: "relative"}}>
				<section className="dialog">
			      	<div className="entry-line-med">
			      		<form className="vert">
			      			<div className="vert-labels">
			      				<input className="ri" type="radio" id="isNew" name="instType" 
			      					onChange={this.handleChange} checked={this.state.isNew}/>
			      				<input className="ri" type="radio" id="isChanging" name="instType" 
			      					onChange={this.handleChange} checked={this.state.isChanging} />
			      			</div>	
			      		</form>
			      		<div className="vert-labels">
			      			<label className="bel" htmlFor="isNew"> Establish New Instructions </label>
			      			<label className="bel" htmlFor="isChanging"> Change Existing Instructions </label>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="lineNumber"> Line # </label>
			      			<input className="ti" type="text" id="lineNumber" value={this.state.lineNumber} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-small">
			      		<form className="hori">
			      			<input type="radio" id="isFirstParty" name="partyType" 
			      				onChange={this.handleChange} checked={this.state.isFirstParty} />
			      			<label className="hrel" htmlFor="isFirstParty"> 1st Party </label>
			      			<input type="radio" id="isThirdParty" name="partyType" 
			      				onChange={this.handleChange} checked={this.state.isThirdParty} />
			      			<label className="hrel" htmlFor="isThirdParty"> 3rd Party </label>
			      		</form>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="payee"> Payee </label>
			      			<input className="ti-large" type="text" id="payee" value={this.state.payee} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="attnMessage"> Attention </label>
			      			<input className="ti" type="text" id="attnMessage" value={this.state.attnMessage} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="address"> Address </label>
			      			<input className="ti-large" type="text" id="address" value={this.state.address} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="city"> City </label>
			      			<input className="ti" type="text" id="city" value={this.state.city} onChange={this.handleChange}/>
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="state"> State/Province </label>
			      			<input className="ti" type="text" id="state" value={this.state.state} onChange={this.handleChange}/> 
			      		</div>
			      		<div className="entry">
			      			<label className="el" htmlFor="zip"> Zip/Postal Code </label>
			      			<input className="ti" type="text" id="zip" value={this.state.zip} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="memo"> Memo </label>
			      			<input className="ti-large" type="text" id="memo" value={this.state.memo} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-med">
			      		<div className="entry">
			      			<label className="el" htmlFor="stubInfo"> Check Stub Information </label>
			      			<input className="ti-large" type="text" id="stubInfo" value={this.state.stubInfo} onChange={this.handleChange}/>
			      		</div>
			      	</div>
			      	<div className="entry-line-small">
			      		<form className="hori">
			      			<input type="checkbox" id="notPrintingAddress"
			      				onChange={this.handleChange} checked={this.state.notPrintingAddress} />
			      			<label className="hrel" htmlFor="notPrintingAddress"> Do not print address above on the check to the third party. </label>
			      		</form>
			      		<div className="entry">
			      			<label className="el" htmlFor="escheatmentState"> State </label>
			      			<input className="ti-small" type="text" id="escheatmentState" value={this.state.escheatmentState} onChange={this.handleChange}/> 
			      		</div>
			      	</div>
			      	<div className="btm-rt">
				      	<InstructionEntryButton cancel={true} editing={this.props.editing} clickHandler={this.buttonClickHandler} />
						<InstructionEntryButton cancel={false} editing={this.props.editing} clickHandler={this.buttonClickHandler} />
					</div>
				</section>
				
			</div>
		);
	}
});

var InstructionEntryButton = React.createClass({
	handleClick: function(){
		this.props.clickHandler(this.props.cancel);
	},
	render: function(){
		var text = this.props.cancel ? "Cancel" : (this.props.editing ? "Update" : "Create");

		return (
			<div className="instructionEntryButton" style={{display: "inline-block"}}>
				<input type="button" onClick={this.handleClick} value={text} />
			</div>
		)
	}
});

var InfoButton = React.createClass({
	render: function(){

	}
});

var NavControls = React.createClass({
	render: function() {
		return (
			<footer className="navControls">
					<NavArrow isLeft={true} enabled={this.props.leftEnabled} navHandler={this.props.navHandler} />
					<NavArrow isLeft={false} enabled={this.props.rightEnabled} navHandler={this.props.navHandler} />
			</footer>
		);
	}
});

var NavArrow = React.createClass({
	handleClick: function() {
		this.props.navHandler(this.props.isLeft);
	},
	render: function() {
		var symbol = this.props.isLeft ? "<<||" : "||>>";
		var color = this.props.enabled ? "green" : "grey";

		return (
			<div className="navArrow">
				<input className="arrow" type="button" onClick={this.handleClick} style={{color: color}} value={symbol}></input>
			</div>
		);
	}
});


ReactDOM.render(
  <Container maxStep={3}/>,
  document.getElementById('content')
);