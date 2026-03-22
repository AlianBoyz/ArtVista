// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AuthContext } from "../Context/AuthProvider";

// const url = import.meta.env.VITE_BASE_URL;
// const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// function PaintingDetails() {
//   const{login}= useContext(AuthContext);

//   const { id } = useParams();

//   const [painting, setPainting] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [view, setView] = useState("choice"); 

//   const [pendingAction, setPendingAction] = useState(null); 

//   const [name,setName] = useState("");
//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");
//   const [phone,setPhone] = useState("");

//   const [showPassword,setShowPassword] = useState(false);
//   const [error,setError] = useState("");

//   useEffect(() => {
//     getPainting();
//   }, []);

//   const getPainting = async () => {
//     const res = await fetch(`${url}/paintings/${id}`);
//     const json = await res.json();
//     setPainting(json.data);
//   };

//   const checkLogin = (action) => {

//     const token = localStorage.getItem("token");

//     if (!token) {
//       setPendingAction(action);
//       setShowModal(true);
//       setView("choice");
//       return false;
//     }

//     return true;
//   };

//   const addToCart = () => {
//     if (!checkLogin("cart")) return;
//     console.log("Add to cart executed");
//   };

//   const buyNow = () => {
//     if (!checkLogin("buy")) return;
//     console.log("Buy now executed");
//   };

//   const continueAction = () => {
//     if(pendingAction === "cart"){
//       console.log("Add to cart executed");
//     }
//     if(pendingAction === "buy"){
//       console.log("Buy now executed");
//     }
//   };

//   const handleLogin = async () => {

//     const res = await fetch(`${url}/auth/login`,{
//       method:"POST",
//       headers:{ "Content-Type":"application/json"},
//       body:JSON.stringify({email,password})
//     });

//     const data = await res.json();

//     if(data.data?.token){
//       // localStorage.setItem("token",data.data.token);
//       login(data.data.token);
//       setShowModal(false);
//       continueAction();
//     }else{
//       setError("Invalid credentials");
//     }
//   };

//   const handleSignup = async (e) => {

//     e.preventDefault();

//     const res = await fetch(`${url}/auth/signup`,{
//       method:"POST",
//       headers:{ "Content-Type":"application/json"},
//       body:JSON.stringify({name,email,password,phone})
//     });

//     const data = await res.json();

//     if(data.success){
//       localStorage.setItem("token",data.data.token);
//       setShowModal(false);
//       continueAction();
//     }else{
//       setError(data.message);
//     }
//   };

//   if(!painting) return <h2>Loading...</h2>;

//   return (

//     <div style={{padding:"40px"}}>

//       {/* Painting Section */}

//       <div style={{display:"flex",gap:"40px"}}>

//         <img
//           src={`${imageUrl}${painting.imageUrl}`}
//           alt={painting.title}
//           style={{width:"400px",height:"400px",objectFit:"cover"}}
//         />

//         <div>

//           <h1>{painting.title}</h1>

//           <p>by {painting.artist.name}</p>

//           <p>{painting.description}</p>

//           <p><b>Medium:</b> {painting.medium}</p>
//           <p><b>Size:</b> {painting.size}</p>
//           <p><b>Year:</b> {painting.year}</p>

//           <h2>₹{painting.price}</h2>

//           <div style={{marginTop:"20px",display:"flex",gap:"20px"}}>
//             <button onClick={buyNow}>Buy Now</button>
//             <button onClick={addToCart}>Add to Cart</button>
//           </div>

//         </div>

//       </div>

//       {/* Artist Section */}

//       <div style={{marginTop:"60px"}}>

//         <h2>About the Artist</h2>

//         <div style={{display:"flex",gap:"20px",alignItems:"center"}}>

//           <img
//             src={`${imageUrl}${painting.artist.profileImage}`}
//             alt={painting.artist.name}
//             style={{width:"120px",height:"120px",borderRadius:"50%"}}
//           />

//           <div>
//             <h3>{painting.artist.name}</h3>
//             <p>{painting.artist.bio}</p>
//           </div>

//         </div>

//       </div>

//       {/* Modal */}

//       {showModal && (

//         <div style={styles.overlay}>

//           <div style={styles.modal}>

//             {view === "choice" && (
//               <>
//                 <h3>New User?</h3>

//                 <button onClick={()=>setView("signup")}>
//                   Yes
//                 </button>

//                 <button onClick={()=>setView("login")}>
//                   No
//                 </button>
//               </>
//             )}

//             {view === "login" && (
//               <>
//                 <h3>Login</h3>

//                 <input
//                   type="email"
//                   placeholder="Email"
//                   onChange={(e)=>setEmail(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   type="password"
//                   placeholder="Password"
//                   onChange={(e)=>setPassword(e.target.value)}
//                   style={styles.input}
//                 />

//                 {error && <p style={{color:"red"}}>{error}</p>}

//                 <button onClick={handleLogin}>
//                   Login
//                 </button>

//                 <p onClick={()=>setView("signup")} style={{cursor:"pointer"}}>
//                   New user? Signup
//                 </p>
//               </>
//             )}

//             {view === "signup" && (

//               <form onSubmit={handleSignup}>

//                 <h3>Signup</h3>

//                 <input
//                   placeholder="Name"
//                   onChange={(e)=>setName(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   placeholder="Email"
//                   onChange={(e)=>setEmail(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   type={showPassword ? "text":"password"}
//                   placeholder="Password"
//                   onChange={(e)=>setPassword(e.target.value)}
//                   style={styles.input}
//                 />

//                 <button
//                   type="button"
//                   onClick={()=>setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? "Hide":"Show"}
//                 </button>

//                 <input
//                   placeholder="Phone"
//                   onChange={(e)=>setPhone(e.target.value)}
//                   style={styles.input}
//                 />

//                 <button type="submit">
//                   Signup
//                 </button>

//                 <p onClick={()=>setView("login")} style={{cursor:"pointer"}}>
//                   Already have account? Login
//                 </p>

//               </form>

//             )}

//             <button onClick={()=>setShowModal(false)}>
//               Close
//             </button>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }

// const styles = {

//   overlay:{
//     position:"fixed",
//     top:0,
//     left:0,
//     width:"100%",
//     height:"100%",
//     background:"rgba(0,0,0,0.5)",
//     display:"flex",
//     justifyContent:"center",
//     alignItems:"center"
//   },

//   modal:{
//     background:"white",
//     padding:"30px",
//     borderRadius:"8px",
//     width:"300px",
//     textAlign:"center"
//   },

//   input:{
//     width:"100%",
//     padding:"10px",
//     marginBottom:"10px"
//   }

// };

// export default PaintingDetails;


// import { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Context/AuthProvider";

// const url = import.meta.env.VITE_BASE_URL;
// const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// function PaintingDetails() {

//   const { login, token } = useContext(AuthContext);

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [painting, setPainting] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [view, setView] = useState("choice");

//   const [pendingAction, setPendingAction] = useState(null);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     getPainting();
//   }, []);

//   const getPainting = async () => {

//     const res = await fetch(`${url}/paintings/${id}`);
//     const json = await res.json();

//     setPainting(json.data);

//   };

//   const checkLogin = (action) => {

//     if (!token) {
//       setShowModal(true)
//       setPendingAction(action);
//       setView("choice");
//       return false;

//     }

//     return true;

//   };

//     const addToCart = async () => {

//       if (!checkLogin("cart")) 
        
//         return;

//       try {

//         const userId = localStorage.getItem("userId");

//         const res = await fetch(`${url}/carts/items`, {

//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },

//           body: JSON.stringify({
//             userId: userId,
//             paintingId: painting.id,
//             quantity: 1
//           })

//         });

//         const data = await res.json();

//         if (data.success) {

//           alert("Added to cart");

//           navigate("/cart");

//         } else {

//           alert(data.message);

//         }

//       } catch (error) {

//         console.log(error);

//       }

//     };
//   const buyNow = () => {

//     if (!checkLogin("buy")) return;

//     navigate("/checkout");

//   };

//   const continueAction = () => {

//     if (pendingAction === "cart") {
//       addToCart();
//     }

//     if (pendingAction === "buy") {
//       console.log(pendingAction)

//       buyNow();

//     }
//   };

//   const handleLogin = async () => {
//     setShowModal(false);
//     const res = await fetch(`${url}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });
//     const data = await res.json();
//     if (data.data?.token) {
//       login(data.data.token);
//       localStorage.setItem("userId", data.data.userId); 
//       setShowModal(false);
//       continueAction();
//     } else {
//       setError("Invalid credentials");
//     }

//   };

//   const handleSignup = async (e) => {

//     e.preventDefault();

//     const res = await fetch(`${url}/auth/signup`, {

//       method: "POST",

//       headers: { "Content-Type": "application/json" },

//       body: JSON.stringify({ name, email, password, phone })

//     });

//     const data = await res.json();

//     if (data.success) {

//       login(data.data.token);

//       setShowModal(false);

//       continueAction();

//     } else {

//       setError(data.message);

//     }

//   };

//   if (!painting) return <h2>Loading...</h2>;

//   return (

//     <div style={{ padding: "40px" }}>

//       {/* Painting Section */}

//       <div style={{ display: "flex", gap: "40px" }}>

//         <img
//           src={`${imageUrl}${painting.imageUrl}`}
//           alt={painting.title}
//           style={{ width: "400px", height: "400px", objectFit: "cover" }}
//         />

//         <div>

//           <h1>{painting.title}</h1>

//           <p>by {painting.artist.name}</p>

//           <p>{painting.description}</p>

//           <p><b>Medium:</b> {painting.medium}</p>
//           <p><b>Size:</b> {painting.size}</p>
//           <p><b>Year:</b> {painting.year}</p>

//           <h2>₹{painting.price}</h2>

//           <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>

//             <button onClick={buyNow}>Buy Now</button>

//             <button onClick={addToCart}>Add to Cart</button>

//           </div>

//         </div>

//       </div>

//       {/* Artist Section */}

//       <div style={{ marginTop: "60px" }}>

//         <h2>About the Artist</h2>

//         <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

//           <img
//             src={`${imageUrl}${painting.artist.profileImage}`}
//             alt={painting.artist.name}
//             style={{ width: "120px", height: "120px", borderRadius: "50%" }}
//           />

//           <div>

//             <h3>{painting.artist.name}</h3>

//             <p>{painting.artist.bio}</p>

//           </div>

//         </div>

//       </div>

//       {/* Modal */}

//       {showModal && (

//         <div style={styles.overlay}>

//           <div style={styles.modal}>

//             {view === "choice" && (

//               <>
//                 <h3 >New User?</h3>

//                 <button onClick={() => setView("signup")}>Yes</button>

//                 <button onClick={() =>setView("login") }>No</button>
//               </>

//             )}

//             {view === "login" && (

//               <>

//                 <h3>Login</h3>

//                 <input
//                   type="email"
//                   placeholder="Email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   type="password"
//                   placeholder="Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={styles.input}
//                 />

//                 {error && <p style={{ color: "red" }}>{error}</p>}

//                 <button onClick={handleLogin}>Login</button>

//                 <p
//                   onClick={() => setView("signup")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   New user? Signup
//                 </p>

//               </>

//             )}

//             {view === "signup" && (

//               <form onSubmit={handleSignup}>

//                 <h3>Signup</h3>

//                 <input
//                   placeholder="Name"
//                   onChange={(e) => setName(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   placeholder="Email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   style={styles.input}
//                 />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   style={styles.input}
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>

//                 <input
//                   placeholder="Phone"
//                   onChange={(e) => setPhone(e.target.value)}
//                   style={styles.input}
//                 />

//                 <button type="submit">Signup</button>

//                 <p
//                   onClick={() => setView("login")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Already have account? Login
//                 </p>

//               </form>

//             )}

//             <button onClick={() => setShowModal(false)}>Close</button>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }

// const styles = {

//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   },

//   modal: {
//     background: "white",
//     padding: "30px",
//     borderRadius: "8px",
//     width: "300px",
//     textAlign: "center"
//   },

//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "10px"
//   }

// };

// export default PaintingDetails;

import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

const url = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

function PaintingDetails() {

  const { login, token } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("choice");

  const [pendingAction, setPendingAction] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPainting();
  }, []);

  // ✅ NEW FIX: Run pending action AFTER login (token changes)
  useEffect(() => {
    if (token && pendingAction) {
      setShowModal(false); // close modal after login/signup
      continueAction();    // perform previous action (cart/buy)
      setPendingAction(null); // reset action (IMPORTANT)
    }
  }, [token]); // runs when token changes

  const getPainting = async () => {
    const res = await fetch(`${url}/paintings/${id}`);
    const json = await res.json();
    setPainting(json.data);
  };

  const checkLogin = (action) => {

    if (!token) {
      setShowModal(true);
      setPendingAction(action); // store action (cart/buy)
      setView("choice");
      return false;
    }

    return true;
  };

  const addToCart = async () => {

    if (!checkLogin("cart")) return;

    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(`${url}/carts/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          paintingId: painting.id,
          quantity: 1
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Added to cart");
        navigate("/cart");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const buyNow = () => {
    if (!checkLogin("buy")) return;
    navigate("/checkout");
  };

  // ✅ UPDATED: Safe handling of pending action
  const continueAction = () => {
    if (!pendingAction) return;

    if (pendingAction === "cart") {
      addToCart();
    }

    if (pendingAction === "buy") {
      buyNow();
    }
  };

  // ✅ FIXED: removed continueAction() from here
  const handleLogin = async () => {

    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.data?.token) {
      login(data.data.token);
      localStorage.setItem("userId", data.data.userId);

      // ✅ FIX: only close modal here, DO NOT call continueAction
      setShowModal(false);

      // ❌ REMOVED:
      // continueAction();  <-- this was causing issue

    } else {
      setError("Invalid credentials");
    }
  };

  // ✅ FIXED: removed continueAction() from here
  const handleSignup = async (e) => {

    e.preventDefault();

    const res = await fetch(`${url}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await res.json();

    if (data.success) {
      login(data.data.token);

      // ✅ FIX: close modal only
      setShowModal(false);

      // ❌ REMOVED:
      // continueAction();

    } else {
      setError(data.message);
    }
  };

  if (!painting) return <h2>Loading...</h2>;

  return (

    <div style={{ padding: "40px" }}>

      <div style={{ display: "flex", gap: "40px" }}>

        <img
          src={`${imageUrl}${painting.imageUrl}`}
          alt={painting.title}
          style={{ width: "400px", height: "400px", objectFit: "cover" }}
        />

        <div>
          <h1>{painting.title}</h1>
          <p>by {painting.artist.name}</p>
          <p>{painting.description}</p>

          <p><b>Medium:</b> {painting.medium}</p>
          <p><b>Size:</b> {painting.size}</p>
          <p><b>Year:</b> {painting.year}</p>

          <h2>₹{painting.price}</h2>

          <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
            <button onClick={buyNow}>Buy Now</button>
            <button onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>

            {view === "choice" && (
              <>
                <h3>New User?</h3>
                <button onClick={() => setView("signup")}>Yes</button>
                <button onClick={() => setView("login")}>No</button>
              </>
            )}

            {view === "login" && (
              <>
                <h3>Login</h3>

                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />

                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button onClick={handleLogin}>Login</button>

                <p onClick={() => setView("signup")} style={{ cursor: "pointer" }}>
                  New user? Signup
                </p>
              </>
            )}

            {view === "signup" && (
              <form onSubmit={handleSignup}>
                <h3>Signup</h3>

                <input
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />

                <input
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

                <input
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                />

                <button type="submit">Signup</button>

                <p onClick={() => setView("login")} style={{ cursor: "pointer" }}>
                  Already have account? Login
                </p>
              </form>
            )}

            <button onClick={() => setShowModal(false)}>Close</button>

          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px"
  }
};

export default PaintingDetails;