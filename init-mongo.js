// db.auth('root', 'admin')

db = db.getSiblingDB('brasilswing')

db.createUser({
    user: 'userdev',
    pwd: 'qIEGvDD9Ha9zXjVQ',
    roles: [{
        role: 'readWrite',
        db: 'brasilswing'
    }]
})