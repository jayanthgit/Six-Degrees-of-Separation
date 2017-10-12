class Graph {
    constructor() {
        this.adjacencyList = new Map();
        this.numberOfVerticies = 0;
    }

    addVertex(v) {
        this.adjacencyList.set(v, []);
        this.numberOfVerticies++;
    }

    addEdge(fro, to) {
        //bidirectional
        this.addEdgeInternal(fro, to);
        this.addEdgeInternal(to, fro);
    }

    addEdgeInternal(fro, to) {
        if (!this.adjacencyList.has(fro)) {
            this.adjacencyList.set(fro, []);
            this.numberOfVerticies++;
        }

        let edges = this.adjacencyList.get(fro);
        
        //only add once
        if(edges.indexOf(to) < 0) {
            edges.push(to);
        }
    }

    doesPathExists(from, to) {
        return this.bfs(from, to);
    }

    bfs(from, to) {
        let visited = {};
        let path = {};
        let queue = [];
        queue.push(from);

        path[from] = [];
        visited[from] = true;
        while (queue.length > 0) {
            let vertex = queue.shift();
            let neighbors = this.adjacencyList.get(vertex);
            let neighborslen = neighbors != null ? neighbors.length : 0;
            for (let i = 0; i < neighborslen; i++) {
                let neighborvertex = neighbors[i];
                
                if (!visited[neighborvertex]) {
                    visited[neighborvertex] = true;
                    
                    if(path[neighborvertex] == null) {
                        path[neighborvertex] = [];
                    }
                    path[neighborvertex].push(vertex);

                    if(neighborvertex === to) {
                        return path;
                    }

                    queue.push(neighbors[i]);
                }
            }
        }

        return null;
    }

    bfsBiDirectional(friend1, friend2) {
        let visitedFriend1 = {};
        visitedFriend1[friend1] = true;

        let queueFriend1 = [];
        queueFriend1.push(friend1);

        let visitedFriend2 = {};
        visitedFriend2[friend2] = true;

        let queueFriend2 = [];
        queueFriend2.push(friend2);
        
        while (queueFriend1.length > 0 && queueFriend2.length) {
            this.bfsHelper(queueFriend1, visitedFriend1)            
            this.bfsHelper(queueFriend2, visitedFriend2)            

            //check if they intersect...
            //todo...
        }

        return null;
    }

    bfsHelper(queue, visited) {
        let vertex = queue.shift();
        let neighbors = this.adjacencyList.get(vertex);
        let neighborslen = neighbors != null ? neighbors.length : 0;
        for (let i = 0; i < neighborslen; i++) {
            let neighborvertex = neighbors[i];
            
            if (!visited[neighborvertex]) {
                visited[neighborvertex] = true;
                queue.push(neighbors[i]);
            }
        }
    }
}

class FriendFinder {
    constructor(socialNetworkService) {
        this.sns = socialNetworkService;
    }

    isRelated(personAId, personZId, degreesOfSeparation) {

        let path = this.sns.graph.bfs(personAId, personZId);
        let listPath = this.getPath(path, personZId);

        path = this.sns.graph.bfsBiDirectional(personAId, personZId);

        return (listPath.length - 1) === degreesOfSeparation ? true: false;
    }

    findConnectionPath(personAId, personZId, degreesOfSeparation) {
        // TODO: (BONUS) Implement this function by calling the 'injected' SocialNetworkService to search friends of the Person Ids...
        let path = this.sns.graph.doesPathExists(personAId, personZId);
        let listPath = this.getPath(path, personZId);
        return listPath;
    }

    getPath(path, personZId) {
        let retList = [];
        retList.push(personZId);

        let cur = personZId;
        while(cur) {
            let prev = path[cur];
            if(prev.length === 0) {
                break;
            }

            retList.push(prev[0]);
            cur = prev.length > 0 ? prev[0] : null;
        }

        return retList.reverse();
    }
}

class SocialNetworkService {
    constructor() {
        this.graph = new Graph();
    }

    addPerson(personId) {
        this.graph.addVertex(personId);
    }

    addFriend(personId, friendId) {
        this.graph.addEdge(personId, friendId);
    }

    findFriends(personId) {
    }
}

class MainProgram {
    constructor() {
    }

    execute() {
        {
            const sns = new SocialNetworkService();
            sns.addFriend('UserA', 'UserB');
            sns.addFriend('UserB', 'UserC');
            sns.addFriend('UserA', 'UserD');
            sns.addFriend('UserX', 'UserC');
            sns.addFriend('UserY', 'UserX');
            sns.addFriend('UserZ', 'UserY');

            const friendFinder = new FriendFinder(sns);        
            console.log(friendFinder.isRelated('UserA', 'UserZ', 5))  //true
            console.log(friendFinder.findConnectionPath('UserA', 'UserZ'));
            console.log(friendFinder.isRelated('UserA', 'UserZ', 4)); //false
        }

        {
            const sns = new SocialNetworkService();
            sns.addFriend('Kevin', 'UserB');
            sns.addFriend('UserB', 'UserC');
            sns.addFriend('UserA', 'UserD');
            sns.addFriend('UserX', 'UserC');
            sns.addFriend('UserY', 'UserX');
            sns.addFriend('Bacon', 'UserY');        

            const friendFinder = new FriendFinder(sns);
            console.log(friendFinder.findConnectionPath('Kevin', 'Bacon'));
        }
    }
}

let mainProgram = new MainProgram();
mainProgram.execute();
console.log('complete')
