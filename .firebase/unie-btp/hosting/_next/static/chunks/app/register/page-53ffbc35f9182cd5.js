(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[11],{75649:(e,a,r)=>{Promise.resolve().then(r.bind(r,23488))},23488:(e,a,r)=>{"use strict";r.r(a),r.d(a,{default:()=>C});var s=r(57437),i=r(2265),n=r(5186),t=r(89506),o=r(69842),l=r(16463),d=r(87138),c=r(66648),u=r(72354),m=r(40884),p=r(70456),b=r(55448),h=r(26285),x=r(85274),v=r(51446),g=r(90595),f=r(583),j=r(95256),N=r(81887),y=r(12196),w=r(47971);function C(){let[e,a]=(0,i.useState)(1),[r,C]=(0,i.useState)(""),[k,I]=(0,i.useState)(!1),q=(0,l.useRouter)(),[P,E]=(0,i.useState)({companyName:"",registrationNumber:"",taxId:"",industry:"",foundedDate:"",email:"",phone:"",website:"",address:"",city:"",country:"",ceoName:"",ceoEmail:"",ceoPhone:"",password:"",confirmPassword:""}),[S,Y]=(0,i.useState)(!1),[z,A]=(0,i.useState)(!1),D=e=>{E(a=>({...a,[e.target.name]:e.target.value}))},O=async()=>{if(I(!0),C(""),P.password!==P.confirmPassword){C("Les mots de passe ne correspondent pas"),I(!1);return}try{let e=await (0,n.Xb)(t.I,P.email,P.password);e.user&&(await (0,o.pl)((0,o.JU)(t.db,"companies",e.user.uid),{companyName:P.companyName,registrationNumber:P.registrationNumber,taxId:P.taxId,industry:P.industry,foundedDate:P.foundedDate,isActive:!0,isAccepted:!1,contact:{email:P.email,phone:P.phone,website:P.website,address:P.address,city:P.city,country:P.country},ceo:{name:P.ceoName,email:P.ceoEmail,phone:P.ceoPhone},createdAt:new Date().toISOString()}),q.push("/company-info"))}catch(e){console.log(e.message),console.log(P.email),"auth/email-already-in-use"===e.code?C("L'adresse e-mail est d\xe9j\xe0 utilis\xe9e. Veuillez choisir une autre adresse e-mail."):"auth/invalid-email"===e.code?C("L'adresse e-mail est invalide. Veuillez saisir une adresse e-mail valide."):"auth/weak-password"===e.code?C("Le mot de passe est trop faible. Veuillez choisir un mot de passe plus s\xe9curis\xe9."):"auth/network-request-failed"===e.code?C("La connexion au r\xe9seau a \xe9chou\xe9. Veuillez v\xe9rifier votre connexion internet."):C("Une erreur s'est produite lors de la cr\xe9ation du compte. Veuillez r\xe9essayer.")}finally{I(!1)}};return(0,s.jsxs)("div",{className:"relative min-h-screen  py-12 px-4 sm:px-6 lg:px-8",children:[(0,s.jsx)(c.default,{src:"/unibtp.png",width:500,height:500,alt:"Company Registration",className:" absolute top-0 left-0 w-full h-full object-cover z-0"}),(0,s.jsx)("div",{className:"absolute top-0 left-0 w-full h-full bg-black/20"}),(0,s.jsx)("div",{className:"absolute left-[5%] right-[5%] md:left-[25%] md:right-[25%] mx-auto rounded-sm  py-12 px-4 sm:px-6 lg:px-8 z-50",children:(0,s.jsxs)(u.w,{className:"max-w-2xl mx-auto bg-white ",children:[(0,s.jsxs)(m.u,{className:"flex flex-col gap-3",children:[(0,s.jsx)("h2",{className:"text-center text-3xl font-extrabold text-gray-900",children:"Enregistrez votre entreprise"}),(0,s.jsx)(p.W,{"aria-label":"Registration Progress",value:e/3*100,className:"max-w-md",color:"primary"}),r&&(0,s.jsx)("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded",children:r})]}),(0,s.jsx)(b.G,{children:(0,s.jsxs)("form",{onSubmit:e=>{e.preventDefault(),Y(!0)},className:"space-y-6",children:[1===e&&(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsx)("h3",{className:"text-lg font-medium",children:"Informations de l'entreprise"}),(0,s.jsxs)("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2",children:[(0,s.jsx)(h.Y,{name:"companyName",label:"Nom de l'entreprise",variant:"bordered",value:P.companyName,onChange:D,required:!0,classNames:{input:"border-black",inputWrapper:"border-2 border-black/20 hover:border-black focus-within:!border-black"}}),(0,s.jsx)(h.Y,{name:"registrationNumber",label:"Num\xe9ro d'enregistrement",variant:"bordered",value:P.registrationNumber,onChange:D,required:!0,classNames:{input:"border-black",inputWrapper:"border-2 border-black/20 hover:border-black focus-within:!border-black"}}),(0,s.jsx)(h.Y,{name:"taxId",label:"Num\xe9ro d'identification fiscale",variant:"bordered",value:P.taxId,onChange:D,required:!0,classNames:{input:"border-black",inputWrapper:"border-2 border-black/20 hover:border-black focus-within:!border-black"}}),(0,s.jsx)(h.Y,{name:"industry",label:"Secteur d'activit\xe9",variant:"bordered",value:P.industry,onChange:D,required:!0,classNames:{input:"border-black",inputWrapper:"border-2 border-black/20 hover:border-black focus-within:!border-black"}}),(0,s.jsx)(h.Y,{name:"foundedDate",type:"date",label:"Date de cr\xe9ation",variant:"bordered",value:P.foundedDate,onChange:D,required:!0,classNames:{input:"border-black",inputWrapper:"border-2 border-black/20 hover:border-black focus-within:!border-black"}})]})]}),2===e&&(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsx)("h3",{className:"text-lg font-medium",children:"Informations de contact"}),(0,s.jsxs)("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2",children:[(0,s.jsx)(h.Y,{name:"email",type:"email",label:"Email de l'entreprise",variant:"bordered",value:P.email,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"phone",type:"tel",label:"Num\xe9ro de t\xe9l\xe9phone",variant:"bordered",value:P.phone,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"website",type:"url",label:"Site web",variant:"bordered",value:P.website,onChange:D}),(0,s.jsx)(h.Y,{name:"address",label:"Adresse",variant:"bordered",value:P.address,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"city",label:"Ville",variant:"bordered",value:P.city,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"country",label:"Pays",variant:"bordered",value:P.country,onChange:D,required:!0})]})]}),3===e&&(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsx)("h3",{className:"text-lg font-medium",children:"Informations du CEO et configuration du compte"}),(0,s.jsxs)("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2",children:[(0,s.jsx)(h.Y,{name:"ceoName",label:"Nom complet du CEO",variant:"bordered",value:P.ceoName,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"ceoEmail",type:"email",label:"Email du CEO",variant:"bordered",value:P.ceoEmail,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"ceoPhone",type:"tel",label:"Num\xe9ro de t\xe9l\xe9phone du CEO",variant:"bordered",value:P.ceoPhone,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"password",type:"password",label:"Mot de passe",variant:"bordered",value:P.password,onChange:D,required:!0}),(0,s.jsx)(h.Y,{name:"confirmPassword",type:"password",label:"Confirmer le mot de passe",variant:"bordered",value:P.confirmPassword,onChange:D,required:!0})]})]}),(0,s.jsxs)("div",{className:"flex justify-between",children:[e>1&&(0,s.jsx)(x.A,{color:"default",variant:"flat",onPress:()=>a(e=>e-1),children:"Pr\xe9cedent"}),e<3?(0,s.jsx)(x.A,{color:"primary",onPress:()=>a(e=>e+1),children:"Suivant"}):(0,s.jsx)(x.A,{type:"submit",color:"primary",isLoading:k,disabled:k,spinner:(0,s.jsx)(v.c,{size:"sm",color:"white"}),children:k?"Cr\xe9ation du compte...":"Valider"})]}),(0,s.jsx)("div",{className:"text-sm text-center",children:(0,s.jsx)(d.default,{href:"/login",className:"font-medium text-main hover:text-indigo-500",children:"Vous avez d\xe9j\xe0 un compte? Connectez-vous"})})]})})]})}),(0,s.jsx)(g.R,{isOpen:S,onOpenChange:Y,size:"2xl",children:(0,s.jsx)(f.A,{children:e=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(j.k,{className:"flex flex-col gap-1",children:"Conditions d'utilisation"}),(0,s.jsx)(N.I,{children:(0,s.jsxs)("div",{className:"max-h-[400px] overflow-y-auto",children:[(0,s.jsx)("h3",{className:"font-semibold mb-2",children:"Termes et conditions"}),(0,s.jsx)("p",{className:"mb-4",children:"En cr\xe9ant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialit\xe9."}),(0,s.jsx)("div",{className:"mt-4",children:(0,s.jsx)(y.K,{isSelected:z,onValueChange:A,children:"J'accepte les conditions d'utilisation et la politique de confidentialit\xe9"})})]})}),(0,s.jsxs)(w.R,{children:[(0,s.jsx)(x.A,{color:"danger",variant:"light",onPress:e,children:"Annuler"}),(0,s.jsx)(x.A,{color:"primary",onPress:O,isDisabled:!z,isLoading:k,spinner:(0,s.jsx)(v.c,{size:"sm",color:"white"}),children:"Confirmer l'inscription"})]})]})})})]})}},89506:(e,a,r)=>{"use strict";r.d(a,{I:()=>l,db:()=>d,t:()=>c});var s=r(15236),i=r(5186),n=r(69842),t=r(99854);let o=(0,s.ZF)({apiKey:"AIzaSyArJiDI7NLdSCRJtCOPjbjIv81xICr5hkE",authDomain:"unie-btp.firebaseapp.com",projectId:"unie-btp",storageBucket:"unie-btp.firebasestorage.app",messagingSenderId:"850074500902",appId:"1:850074500902:web:89ec6e2bd0c9165abb8be7"}),l=(0,i.v0)(o),d=(0,n.ad)(o),c=(0,t.cF)(o)}},e=>{var a=a=>e(e.s=a);e.O(0,[358,387,274,895,648,271,236,955,285,847,456,130,215,744],()=>a(75649)),_N_E=e.O()}]);