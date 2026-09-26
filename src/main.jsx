import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {AnimatePresence,motion} from "framer-motion";
import {QRCodeSVG} from "qrcode.react";
import {ShoppingBag,Search,MapPin,Heart,Star,Clock3,ChevronRight,Plus,Minus,Sun,Moon,Truck,ChefHat,PackageCheck,User,Menu as MenuIcon,X,CheckCircle2,Flame,UtensilsCrossed,LayoutDashboard} from "lucide-react";
import "./styles.css";

const fallbackFoods=[
 {id:1,name:"Truffle Smash Burger",restaurant:"Urban Buns",price:249,cat:"Burgers",rating:4.8,img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"},
 {id:2,name:"Hyderabadi Chicken Biryani",restaurant:"Spice Route",price:299,cat:"Biryani",rating:4.9,img:"https://images.unsplash.com/photo-1631515242808-497c3fbd3972?w=900&q=80"},
 {id:3,name:"Margherita Pizza",restaurant:"Napoli House",price:279,cat:"Pizza",rating:4.7,img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900"},
 {id:4,name:"Creamy Alfredo Pasta",restaurant:"Pasta Lab",price:269,cat:"Pasta",rating:4.6,img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900"},
 {id:5,name:"Crispy Chicken Wings",restaurant:"Wing District",price:219,cat:"Chicken",rating:4.8,img:"https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=900"},
 {id:6,name:"Mango Cheesecake",restaurant:"Sweet Theory",price:189,cat:"Desserts",rating:4.9,img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"}
];
const cats=["All","Burgers","Biryani","Pizza","Pasta","Chicken","Desserts"];
const stickers=["🍕","🍔","🍟","🥤","🍗","🌮","🍩","🍜"];
function App(){
 const [dark,setDark]=useState(false),[page,setPage]=useState("login"),[search,setSearch]=useState(""),[cat,setCat]=useState("All");
 const [foods,setFoods]=useState(fallbackFoods);
 const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("foodgo-cart")||"[]")}catch{return[]}});
 const [toast,setToast]=useState("");
 const [active,setActive]=useState(null);
 useEffect(()=>localStorage.setItem("foodgo-cart",JSON.stringify(cart)),[cart]);
 useEffect(()=>{fetch("http://localhost:4000/api/foods").then(r=>r.ok?r.json():[]).then(data=>{if(data.length)setFoods(data)}).catch(()=>{});},[]);
 const filtered=useMemo(()=>foods.filter(f=>(cat==="All"||f.cat===cat)&&(`${f.name} ${f.restaurant}`).toLowerCase().includes(search.toLowerCase())),[search,cat]);
 const add=f=>{setCart(c=>{let x=c.find(i=>i.id===f.id);return x?c.map(i=>i.id===f.id?{...i,q:i.q+1}:i):[...c,{...f,q:1}]});setToast(`${f.name} added to cart ✨`);setTimeout(()=>setToast(""),1800)};
 const total=cart.reduce((s,i)=>s+i.price*i.q,0);
 const onLogout=()=>{setPage("login");setToast("Logged out successfully");setTimeout(()=>setToast(""),1800)};
 return <div className={dark?"app dark":"app"}>
  {page !== "login" && <nav className="nav"><div className="brand" onClick={()=>setPage("home")}><span>🍴</span> FOOD<span>GO</span></div>
   <div className="navlinks"><button onClick={()=>setPage("home")}>Home</button><button onClick={()=>setPage("explore")}>Explore</button><button onClick={()=>setPage("tracking")}>Track Order</button><button onClick={()=>setPage("dashboard")}>Dashboard</button></div>
   <div className="navactions"><button className="iconbtn" onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</button><button className="cartbtn" onClick={()=>setPage("cart")}><ShoppingBag/> <b>{cart.reduce((s,i)=>s+i.q,0)}</b></button><button className="avatar" onClick={onLogout}><User size={18}/></button></div>
  </nav>}
  <main>
   {page==="login"&&<LoginScreen setPage={setPage} setToast={setToast}/>}
   {page==="home"&&<Home filtered={filtered} cat={cat} setCat={setCat} search={search} setSearch={setSearch} add={add} setPage={setPage} setActive={setActive}/>}
   {page==="explore"&&<Explore filtered={filtered} cat={cat} setCat={setCat} search={search} setSearch={setSearch} add={add} setActive={setActive}/>}
   {page==="cart"&&<Cart cart={cart} setCart={setCart} total={total} setPage={setPage}/>}
   {page==="checkout"&&<Checkout total={total} setPage={setPage} setToast={setToast}/>}
   {page==="tracking"&&<Tracking/>}
   {page==="dashboard"&&<Dashboard setPage={setPage}/>}
  </main>
  {page !== "login" && <footer><div><b>🍴 FOODGO</b><p>Good food. Great mood. Delivered.</p></div><div><span>Explore</span><span>Careers</span><span>Support</span></div><div>© 2026 FoodGo</div></footer>}
  <AnimatePresence>{toast&&<motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} className="toast">✓ {toast}</motion.div>}</AnimatePresence>
  <AnimatePresence>{active&&<FoodModal food={active} close={()=>setActive(null)} add={add}/>}</AnimatePresence>
 </div>
}
function LoginScreen({setPage,setToast}){
 const [form,setForm]=useState({email:"",password:""});
 const [showPassword,setShowPassword]=useState(false);
 const handleSubmit=e=>{
  e.preventDefault();
  if(!form.email || !form.password){
   setToast("Please enter both email and password");
   setTimeout(()=>setToast(""),1800);
   return;
  }
  setPage("home");
  setToast("Welcome back to FoodGo");
  setTimeout(()=>setToast(""),1800);
 };
 return <section className="loginShell">
  <div className="loginPanel">
   <div className="loginBrand"><div className="brand mark"><span>🍴</span> FOOD<span>GO</span></div></div>
   <div className="loginIntro">
    <span className="eyebrow loginEyebrow">WELCOME BACK</span>
    <h1>Sign in to your foodie life.</h1>
    <p>Track orders, save favorites, and never miss your next craving.</p>
   </div>
   <form className="loginForm" onSubmit={handleSubmit}>
    <label>
     <span>Email</span>
     <div className="inputWrap"><User size={16}/><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@email.com" /></div>
    </label>
    <label>
     <span>Password</span>
     <div className="inputWrap"><User size={16}/><input type={showPassword?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" /></div>
    </label>
    <div className="loginExtras">
     <label className="checkRow"><input type="checkbox" checked={showPassword} onChange={()=>setShowPassword(!showPassword)} /><span>Show password</span></label>
     <button type="button" className="textLink">Forgot password?</button>
    </div>
    <button type="submit" className="primary loginBtn">Sign in <ChevronRight size={18}/></button>
    <button type="button" className="secondaryBtn" onClick={()=>{setPage("home");setToast("Signed in as guest");setTimeout(()=>setToast(""),1800);}}>Continue as guest</button>
   </form>
   <div className="loginFooter">
    <div className="divider"><span>or continue with</span></div>
    <div className="socials"><button type="button">Google</button><button type="button">Apple</button></div>
    <p>New here? <button type="button" className="textLink" onClick={()=>setPage("home")}>Create an account</button></p>
   </div>
  </div>
  <div className="loginArt">
   <div className="artCard mainDish"><span>🔥</span><div><b>Best Seller</b><p>Truffle Smash Burger</p></div></div>
   <div className="artCard promo"><b>Free Delivery</b><span>On orders above ₹499</span></div>
   <div className="artFood"><img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=900" alt="food" /></div>
   <div className="miniStat"><b>4.9/5</b><span>Avg rating</span></div>
  </div>
 </section>
}
function Floating(){return <div className="floating">{stickers.map((s,i)=><motion.div key={i} className={`sticker s${i}`} animate={{y:[0,-18,0],rotate:[-8,8,-8]}} transition={{duration:3+i*.35,repeat:Infinity,ease:"easeInOut"}}>{s}</motion.div>)}</div>}
function Home({filtered,cat,setCat,search,setSearch,add,setPage,setActive}){
 return <><section className="hero"><Floating/><div className="heroText"><div className="eyebrow"><Flame size={16}/> #1 FOOD DELIVERY EXPERIENCE</div><h1>Cravings have<br/><em>never looked</em><br/>this good.</h1><p>Discover handpicked local restaurants, legendary dishes and lightning-fast delivery — all in one beautiful place.</p>
 <div className="search"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pizza, biryani, burgers..."/><button onClick={()=>setPage("explore")}>Explore</button></div>
 <div className="trust"><span>⚡ 25 min avg.</span><span>⭐ 4.9 customer rating</span><span>🛵 Live tracking</span></div></div><div className="heroVisual"><motion.div className="orb" animate={{scale:[1,1.05,1],rotate:[0,3,0]}} transition={{duration:5,repeat:Infinity}}><img src={(filtered[0]||fallbackFoods[0]).img}/></motion.div><div className="floatcard c1">🔥 Trending<br/><b>Smash Burger</b></div><div className="floatcard c2">⭐ 4.9<br/><b>Top rated</b></div><div className="floatcard c3">🛵 <b>18 min</b><br/>at your door</div></div></section>
 <section className="section"><div className="sectionHead"><div><div className="eyebrow">DISCOVER</div><h2>What's calling you?</h2></div><button onClick={()=>setPage("explore")} className="textbtn">View all <ChevronRight/></button></div><div className="chips">{cats.map(c=><button className={cat===c?"chip active":"chip"} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div>
 <div className="grid">{filtered.slice(0,6).map(f=><FoodCard key={f.id} f={f} add={add} setActive={setActive}/>)}</div></section>
 <section className="banner"><div><div className="eyebrow">WEEKEND DROP</div><h2>Free delivery.<br/><em>Zero excuses.</em></h2><p>Use code <b>FOODGO100</b> and unlock up to ₹100 off.</p><button className="primary">Claim offer →</button></div><div className="bannerEmoji">🍕🍔🍟</div></section></>
}
function Explore({filtered,cat,setCat,search,setSearch,add,setActive}){return <section className="section explore"><div className="exploreTop"><div><div className="eyebrow">ALL RESTAURANTS</div><h1>Find your next favorite.</h1></div><div className="search small"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."/></div></div><div className="chips">{cats.map(c=><button className={cat===c?"chip active":"chip"} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div><div className="grid">{filtered.map(f=><FoodCard key={f.id} f={f} add={add} setActive={setActive}/>)}</div></section>}
function FoodCard({f,add,setActive}){return <motion.article whileHover={{y:-8}} className="foodcard" onClick={()=>setActive?.(f)}><div className="foodimg"><img src={f.img}/><button className="heart" onClick={e=>{e.stopPropagation();}}><Heart/></button><span className="badge">🔥 {f.cat}</span></div><div className="foodinfo"><div className="muted">{f.restaurant}</div><h3>{f.name}</h3><div className="meta"><span>⭐ {f.rating}</span><span>•</span><span>20–30 min</span></div><div className="price">₹{f.price}<button onClick={e=>{e.stopPropagation();add(f);}}><Plus/></button></div></div></motion.article>}
function Cart({cart,setCart,total,setPage}){return <section className="section cartpage"><div className="eyebrow">YOUR BAG</div><h1>Good choices. 🛍️</h1>{!cart.length?<div className="empty"><div>🛒</div><h2>Your cart is hungry.</h2><p>Add something delicious to get started.</p></div>:<div className="cartlayout"><div>{cart.map(i=><div className="cartitem" key={i.id}><img src={i.img}/><div className="ci"><h3>{i.name}</h3><p>{i.restaurant}</p><b>₹{i.price}</b></div><div className="qty"><button onClick={()=>setCart(c=>c.map(x=>x.id===i.id?{...x,q:Math.max(1,x.q-1)}:x))}><Minus/></button>{i.q}<button onClick={()=>setCart(c=>c.map(x=>x.id===i.id?{...x,q:x.q+1}:x))}><Plus/></button></div></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>₹{total}</b></div><div><span>Delivery</span><b>₹39</b></div><div><span>Taxes</span><b>₹{Math.round(total*.05)}</b></div><hr/><div className="grand"><span>Total</span><b>₹{total+39+Math.round(total*.05)}</b></div><button className="primary full" onClick={()=>setPage("checkout")}>Continue to checkout <ChevronRight/></button></aside></div>}</section>}
function Checkout({total,setPage,setToast}){const [submitted,setSubmitted]=useState(false);const amount=total+39+Math.round(total*.05);const upiId=import.meta.env.VITE_UPI_ID||"your-upi-id@bank";const upiName=import.meta.env.VITE_UPI_NAME||"FoodGo";const upiUrl=`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("FoodGo order")}`;if(submitted)return <section className="success"><motion.div initial={{scale:0}} animate={{scale:1}} className="successicon"><CheckCircle2 size={70}/></motion.div><h1>Payment submitted! 🎉</h1><p>We will confirm your payment before preparing the order.</p><button className="primary" onClick={()=>setPage("tracking")}>Track my order <Truck/></button></section>;return <section className="section checkout"><div><div className="eyebrow">CHECKOUT</div><h1>Almost there.</h1><div className="formbox"><h2>📍 Delivery address</h2><input placeholder="Flat / House / Street"/><input placeholder="City, state, pincode"/><h2>⏱ Delivery time</h2><div className="timeopts"><button className="selected">⚡ ASAP · 25 min</button><button>🕐 Schedule for later</button></div><h2>💳 Pay with UPI</h2><div className="upiPayment"><QRCodeSVG value={upiUrl} size={180} includeMargin/><div><b>Scan to pay ₹{amount}</b><p>UPI ID: {upiId}</p><a className="primary upiLink" href={upiUrl}>Open UPI app</a><button className="paymentDone" onClick={()=>{setSubmitted(true);setToast("Payment marked for verification")}}>I have completed payment</button></div></div><small className="paymentNote">Payment is verified before your order is prepared. Never share your UPI PIN.</small></div></div><aside className="summary"><h2>Pay securely</h2><div><span>Food</span><b>₹{total}</b></div><div><span>Delivery</span><b>₹39</b></div><div><span>Taxes</span><b>₹{Math.round(total*.05)}</b></div><hr/><div className="grand"><span>Total</span><b>₹{amount}</b></div><button className="primary full" onClick={()=>{document.querySelector(".upiPayment")?.scrollIntoView({behavior:"smooth"})}}>Pay with UPI <ChevronRight/></button></aside></section>}
function Tracking(){return <section className="section tracking"><div className="eyebrow">LIVE ORDER #FG2048</div><h1>Your food is on the move. 🛵</h1><div className="trackcard"><div className="map"><div className="route"></div><motion.div className="scooter" animate={{x:[0,170,340]}} transition={{duration:7,repeat:Infinity,ease:"linear"}}>🛵</motion.div><div className="homepin">🏠</div><div className="restaurantpin">🍔</div></div><div className="status"><div className="statushead"><div><b>Arriving in</b><strong>18 min</strong></div><span className="live">● LIVE</span></div>{[["Order confirmed","Restaurant accepted your order",CheckCircle2],["Preparing your food","Chef is working their magic",ChefHat],["Out for delivery","Alex is riding your way",Truck],["Delivered","Enjoy your meal!",PackageCheck]].map(([a,b,I],i)=><div className={i<2?"step done":"step"} key={a}><div className="stepicon"><I/></div><div><b>{a}</b><p>{b}</p></div></div>)}</div></div></section>}
function Dashboard({setPage}){return <section className="section dash"><div className="eyebrow">CONTROL CENTER</div><h1>FoodGo Dashboard</h1><div className="rolegrid">{[["Customer","Manage orders, favorites & addresses","👤","tracking"],["Restaurant","Menu, incoming orders & revenue","👨‍🍳","dashboard"],["Delivery","Assigned drops & live status","🛵","tracking"]].map(x=><motion.div whileHover={{y:-7}} className="role" key={x[0]} onClick={()=>setPage(x[3])}><span>{x[2]}</span><h2>{x[0]}</h2><p>{x[1]}</p><button>Open workspace <ChevronRight/></button></motion.div>)}</div><div className="stats"><div><b>₹48.6K</b><span>Today revenue</span></div><div><b>1,284</b><span>Orders today</span></div><div><b>4.92</b><span>Average rating</span></div><div><b>23 min</b><span>Avg delivery</span></div></div></section>}
function FoodModal({food,close,add}){return <div className="modalbg" onClick={close}><motion.div initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><img src={food.img}/><div><div className="eyebrow">{food.restaurant}</div><h2>{food.name}</h2><p>Chef-crafted, freshly prepared and delivered with care.</p><div className="modalprice">₹{food.price}<button className="primary" onClick={()=>{add(food);close()}}>Add to bag <Plus/></button></div></div></motion.div></div>}
createRoot(document.getElementById("root")).render(<App/>);