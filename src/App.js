import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]); // state: short term memory store of React
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser)
        setUser(authUser) // make user account persistent on app

        // if (authUser.displayName) { // if username is displayed on the webpage <- this means user has logged in
        //   // dont update username
        // } else {
        //   // if we just created someone...
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }
      } else {
        // user has logged out...
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions before re-firing the userEffect()
      unsubscribe() // this helps to prevent duplication <- improve performance!
    }
  }, [user, username]) // this method fired off when login, logout, and signup

  // useEffect(): Runs a piece of code based on a specific condition
  useEffect(() => {
    // this is where the code runs
    // onSnapshot(): get all the updated data from document(posts)
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires off
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [posts]) // the method is executed whenever "posts" are altered

  const signUp = (event) => {
    event.preventDefault()

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message)) // backend validation

      setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            // key <- prevent the previous posts from being re-rendered after updating db
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CGE9WkMA_GC/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? ( // optional chaining to check if "user" is undefined
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, you need to login to upload</h3>
      )}

      {/* <Post username="tolang0825" caption="WOW what a goal by Cristiano!" imageURL="https://besthqwallpapers.com/Uploads/4-5-2018/50948/thumb2-cristiano-ronaldo-real-madrid-traditional-celebration-of-goals-la-liga-spain.jpg" />
      <Post username="kwhite" caption="Sweet Home!" imageURL="https://img.huffingtonpost.com/asset/5cd594772000003000977ce3.jpeg?ops=scalefit_630_noupscale" />
      <Post username="smorven" caption="BOOM!" imageURL="https://i2.wp.com/nintendosoup.com/wp-content/uploads/2020/04/MK-NAO-May20-2x.jpg?resize=1038%2C576&ssl=1" /> */}
    </div>
  );
}

export default App;
