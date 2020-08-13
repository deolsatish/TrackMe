var fizzbuzz = (function(){
    function process(n){
      if(!(n%15)){
        return 'FizzBuzz'
      }
      if(!(n%3)){
        return 'Fizz'
      }
      if(!(n%5)){
        return 'Buzz'
      }
      return n
    }
  
    return {
      process: process
    }
  })()