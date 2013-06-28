/**
 * null means the connction is local to the client
 * and will not make an attempt to sync with the server
 */
Errors = new Meteor.Collection(null);

throwError = function(message){
	Errors.insert({message: message});
}

clearError = function(){
	Errors.remove({seen: true});
}