const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// TASK 1
class EventEmitter {
    listeners = {};

    addListener(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
        return this;
    } 

    on(eventName, fn) {
        return this.addListener(eventName, fn);
    }

    removeListeners(eventName, fn) {
        let listener = this.listeners[eventName];
        if(!listener) return this;

        for(let i = listener.length; i > 0; i--) {
            if(listener[i] === fn) {
                listener.splice(i, 1);
                break;
            }
        }

        return this;
    }

    off(eventName, fn) {
        return this.removeListeners(eventName, fn);
    }

    once(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        const onceWrapper = () => {
            fn();
            this.removeListeners(eventName, onceWrapper);
        }
        this.listeners[eventName].push(onceWrapper);
        return this;
    }

    emit(eventName, ...args) {
        let functions = this.listeners[eventName];
        if(!functions) return false;

        functions.forEach((func) => {
            func(...args);
        });
        return true;
    }

    listenersCount(eventName) {
        let functions = this.listeners[eventName] || [];
        return functions.length;
    }

    rawListeners(eventName) {
        return this.listeners[eventName];
    }
}

const myEmitter = new EventEmitter();

function c1() {
    console.log('an event occurred!');
}

function c2() {
    console.log('yet another event occurred!');
}

myEmitter.on('eventOne', c1); // Register for eventOne
myEmitter.on('eventOne', c2); // Register for eventOne

// Register eventOnce for one time execution
myEmitter.once('eventOnce', () => console.log('eventOnce once fired'));
myEmitter.once('init', () => console.log('init once fired'));

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg)=> console.log(`Got ${code} and ${msg}`));


myEmitter.emit('eventOne');

// Emit 'eventOnce' -> After this the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce');


myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init'); // Will not be fired
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

// Get listener's count
console.log(myEmitter.listenersCount('eventOne'));

// Get array of rawListeners//
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'));

// Get listener's count after remove one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1);
console.log(myEmitter.listenersCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenersCount('eventOne'));


//TASK 2

class WithTime extends EventEmitter {
    execute(asyncFunc, ...args) {
      this.emit('begin');
      console.time('execute');
      this.on('data', (data)=> console.log('got data ', data));
      asyncFunc(...args, (err, data) => {
        if (err) {
          return this.emit('error', err);
        }
        this.emit('data', data);
        console.timeEnd('execute');
        this.emit('end');
      });
    }
  }

  const withTime = new WithTime();

  withTime.on('begin', () => console.log('About to execute'));
  withTime.on('end', () => console.log('Done with execute'));
  
  console.log(withTime.rawListeners("end"));

  const readFile = (url, cb) => {
    fetch(url)
      .then((resp) => resp.json()) // Transform the data into json
      .then(function(data) {
        cb(null, data);
      });
  }
  
  withTime.execute(readFile, 'https://jsonplaceholder.typicode.com/posts/1');