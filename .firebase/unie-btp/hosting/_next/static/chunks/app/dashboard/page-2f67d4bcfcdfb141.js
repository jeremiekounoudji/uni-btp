(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[702],{12779:(e,s,t)=>{Promise.resolve().then(t.bind(t,37913))},37913:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>O});var a=t(57437),n=t(2265),i=t(89506),r=t(69842),c=t(5186),l=t(16463),o=t(43259),d=t(86425),u=t(53891),m=t(98319),x=t(85274),h=t(72354),j=t(40884),p=t(85908),y=t(75945),g=t(55448),b=t(85782),f=t(29629),C=t(9139),v=t(964),N=t(93908),A=t(71272),_=t(41197),w=t(90595),I=t(583),E=t(95256),P=t(81887),k=t(47971),S=t(27776),D=t(7476);let F={apikey:"75235639673f693fe1b768.83476984",site_id:"5883449",notify_url:"".concat("http://localhost:3000","/api/payment/notify"),mode:"PRODUCTION"};function O(){let[e,s]=(0,n.useState)(null),[t,O]=(0,n.useState)([]),[T,R]=(0,n.useState)(null),[U,J]=(0,n.useState)(!1),[L,z]=(0,n.useState)(!1),[X,Q]=(0,n.useState)(!0),[q,B]=(0,n.useState)(""),G=(0,l.useRouter)(),M=async()=>{try{await (0,c.w7)(i.I),G.push("/"),S.Am.success("D\xe9connexion r\xe9ussie")}catch(e){S.Am.error("Erreur lors de la d\xe9connexion")}},H=(0,n.useCallback)(async()=>{try{let e=i.I.currentUser;if(!e){G.push("/");return}let t=await (0,r.QT)((0,r.JU)(i.db,"companies",e.uid));t.exists()&&s({id:t.id,...t.data()});let a=(0,r.IO)((0,r.hJ)(i.db,"payments"),(0,r.ar)("companyId","==",e.uid)),n=(await (0,r.PL)(a)).docs.map(e=>({id:e.id,...e.data()}));O(n);let c=await (0,r.QT)((0,r.JU)(i.db,"settings","payments"));c.exists()&&R(c.data())}catch(e){B(e.message),S.Am.error("Error loading data")}finally{Q(!1)}},[G]);(0,n.useEffect)(()=>{H()},[H]);let K=async()=>{if(T&&e)try{let s="TR".concat(Date.now());CinetPay.setConfig({apikey:F.apikey,site_id:F.site_id,notify_url:F.notify_url,mode:F.mode}),CinetPay.getCheckout({transaction_id:s,amount:T.amount,currency:"XOF",channels:"ALL",description:"Cotisation ".concat(e.companyName),customer_name:e.ceo.name,customer_surname:e.ceo.name.split(" ")[1]||"",customer_email:e.ceo.email,customer_phone_number:e.ceo.phone,customer_address:e.contact.address,customer_city:e.contact.city,customer_country:"CI",customer_state:e.contact.city,customer_zip_code:""}),CinetPay.waitResponse(async t=>{if("ACCEPTED"===t.status)try{let t=(e.totalCotisation||0)+T.amount;await (0,r.r7)((0,r.JU)(i.db,"companies",e.id),{totalCotisation:t}),await (0,r.ET)((0,r.hJ)(i.db,"payments"),{companyId:e.id,amount:T.amount,date:new Date().toISOString(),status:"successful",transactionId:s}),S.Am.success("Paiement effectu\xe9 avec succ\xe8s"),z(!1),H()}catch(e){console.log("Error updating payment data:",e),S.Am.error("Erreur lors de la mise \xe0 jour des donn\xe9es")}else S.Am.error("Le paiement a \xe9chou\xe9")}),CinetPay.onError(e=>{console.log("CinetPay error:",e),S.Am.error("Erreur lors du paiement")}),CinetPay.onClose(e=>{"REFUSED"===e.status&&S.Am.error("Paiement annul\xe9"),z(!1)})}catch(e){console.log("Payment error:",e),S.Am.error("Erreur lors de l'initialisation du paiement")}};return(0,a.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,a.jsxs)(o.R,{className:"bg-white border-b",children:[(0,a.jsx)(d.H,{children:(0,a.jsx)("p",{className:"font-bold text-inherit",children:"UNIE-BTP"})}),(0,a.jsx)(u.U,{justify:"end",children:(0,a.jsx)(m.k,{children:(0,a.jsx)(x.A,{color:"danger",variant:"flat",onClick:M,children:"D\xe9connexion"})})})]}),(0,a.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,a.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,a.jsxs)(h.w,{className:"p-4",children:[(0,a.jsxs)(j.u,{className:"flex justify-between",children:[(0,a.jsxs)("div",{className:"flex gap-3",children:[(0,a.jsx)(p.h,{src:"/company-logo.png",size:"lg"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{className:"text-xl font-bold",children:null==e?void 0:e.companyName}),(0,a.jsx)("p",{className:"text-gray-500",children:null==e?void 0:e.contact.email})]})]}),(0,a.jsx)(x.A,{isIconOnly:!0,variant:"light",onClick:()=>J(!0),children:(0,a.jsx)(D.IYd,{})})]}),(0,a.jsx)(y.j,{}),(0,a.jsx)(g.G,{children:(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Address"}),(0,a.jsx)("p",{children:null==e?void 0:e.contact.address})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Website"}),(0,a.jsx)("p",{children:null==e?void 0:e.contact.website})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Information du CEO"}),(0,a.jsx)("p",{children:null==e?void 0:e.ceo.name}),(0,a.jsx)("p",{children:null==e?void 0:e.ceo.email}),(0,a.jsx)("p",{children:null==e?void 0:e.ceo.phone})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Total Cotisation"}),(0,a.jsxs)("p",{className:"text-xl font-bold",children:[(null==e?void 0:e.totalCotisation)||0," FCFA"]})]})]})})]}),(0,a.jsxs)(h.w,{className:"p-4",children:[(0,a.jsx)(j.u,{children:(0,a.jsxs)("div",{className:"flex justify-between w-full items-center",children:[(0,a.jsx)("h4",{className:"text-xl font-bold",children:"Paiements"}),(0,a.jsx)(x.A,{color:"primary",startContent:(0,a.jsx)(D.XiQ,{}),onClick:()=>z(!0),children:"Payer la cotisation"})]})}),(0,a.jsx)(y.j,{}),(0,a.jsx)(g.G,{children:(0,a.jsxs)(b.b,{"aria-label":"Payment history",children:[(0,a.jsxs)(f.J,{children:[(0,a.jsx)(C.j,{children:"DATE"}),(0,a.jsx)(C.j,{children:"MONTANT"}),(0,a.jsx)(C.j,{children:"STATUS"})]}),(0,a.jsx)(v.y,{children:t.map(e=>(0,a.jsxs)(N.g,{children:[(0,a.jsx)(A.X,{children:new Date(e.date).toLocaleDateString()}),(0,a.jsxs)(A.X,{children:[e.amount," FCFA"]}),(0,a.jsx)(A.X,{children:(0,a.jsx)(_.z,{color:"successful"===e.status?"success":"warning",size:"sm",children:e.status})})]},e.id))})]})})]})]})}),(0,a.jsx)(w.R,{isOpen:L,onOpenChange:z,children:(0,a.jsx)(I.A,{children:e=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(E.k,{children:"Faire un paiement"}),(0,a.jsx)(P.I,{children:(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("p",{children:["Montant \xe0 payer: ",null==T?void 0:T.amount," FCFA"]}),(0,a.jsxs)("p",{children:["Fr\xe9quence de paiement: ",null==T?void 0:T.frequency]}),(0,a.jsxs)("p",{children:["Date d'\xe9ch\xe9ance: ",null==T?void 0:T.dueDay]})]})}),(0,a.jsxs)(k.R,{children:[(0,a.jsx)(x.A,{color:"danger",variant:"light",onPress:e,children:"Annuler"}),(0,a.jsx)(x.A,{color:"primary",onPress:K,children:"Continuer le paiement"})]})]})})})]})}},89506:(e,s,t)=>{"use strict";t.d(s,{I:()=>l,db:()=>o,t:()=>d});var a=t(15236),n=t(5186),i=t(69842),r=t(99854);let c=(0,a.ZF)({apiKey:"AIzaSyArJiDI7NLdSCRJtCOPjbjIv81xICr5hkE",authDomain:"unie-btp.firebaseapp.com",projectId:"unie-btp",storageBucket:"unie-btp.firebasestorage.app",messagingSenderId:"850074500902",appId:"1:850074500902:web:89ec6e2bd0c9165abb8be7"}),l=(0,n.v0)(c),o=(0,i.ad)(c),d=(0,r.cF)(c)}},e=>{var s=s=>e(e.s=s);e.O(0,[358,387,956,274,895,271,955,847,262,565,132,130,215,744],()=>s(12779)),_N_E=e.O()}]);