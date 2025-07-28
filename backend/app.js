const express = require("express");
const cors = require('cors');
const path=require('path');
const bcrypt=require('bcrypt')  
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json())
const {open}=require('sqlite');
const sqlite3=require('sqlite3');
const { error } = require("console");
const dbPath=path.join(__dirname,'gymManagementSystem.db');


let db=null;

const initializeDbAndServer= async ()=>{
  try{
    db=await  open({
      filename:dbPath,
      driver:sqlite3.Database
    });
    app.listen(3000,()=>{
      console.log("Server Running at http://localhost:3000/");
    })
  }
  catch(e){
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
}

initializeDbAndServer();


const authenticateToken=(request,response,next)=>{
  let jwtToken;
  const authHeader=request.headers['authorization'];
  if(authHeader!==undefined){
    jwtToken= authHeader.split(' ')[1];
  }

  if(jwtToken===undefined){
    response.status(401);
    response.send("Invalid Access Token");
  }
  else{
    jwt.verify(jwtToken,'MY_SECRET_TOKEN',async(error,payload)=>{
      if(error){
        response.status(401);
        response.send('Invalid Access Token');
      }
      else{
        request.email=payload.email;
        next();
      }
    })
  }
}

//get members api
app.get("/api/admin/members/",authenticateToken, async (request,response)=>{
  const getMembersQuery=`
  select * from members;
  `;
  const membersArray= await db.all(getMembersQuery);
  response.send(membersArray);
})

//get member api
app.get("/api/admin/members/:email/",authenticateToken, async (request,response)=>{
  const {email}=request.params;

  const getMembersQuery=`
  select * from members
  where email='${email}';
  `;
  const member= await db.get(getMembersQuery);
  if (member) {
    response.status(200).json(member);
  } else {
    response.status(404).json({ error: "Member not found" });
  }
})

//add member api 
app.post("/api/admin/members/",authenticateToken, async (request, response) => {
  const newMember=request.body;
  let {
    name,email,phone,gender,age,joinDate,packageId,active
  }=newMember;

  if(joinDate===undefined){
    joinDate = new Date().toISOString().split("T")[0];
  }
  const postMemberQuery=`
  INSERT INTO 
   members(name,email,phone,gender,age,join_date,package_id,active)
   VALUES('${name}','${email}','${phone}','${gender}',${age},'${joinDate}',${packageId},${active});
  `;
  const dbResponse= await db.run(postMemberQuery);
  const memberId=dbResponse.lastID;
  response.send(`Member Successfully added with MemberId: ${memberId}`);
});

//update member api
app.put("/api/admin/members/:emailId/",authenticateToken, async (request,response)=>{
  const {emailId}=request.params;
  const updatedMemberDetails=request.body;
  const {
    name,email,phone,gender,age,packageId,active
  }=updatedMemberDetails;

  const updateMemberQuery=`
  update members set 
  name='${name}',
  email='${email}',
  phone='${phone}',
  gender='${gender}',
  age=${age},
  package_id=${packageId},
  active=${active}
  where email='${emailId}';
  `;
  await db.run(updateMemberQuery);
  response.send("Details Updated");
})

//delete member api
app.delete("/api/admin/members/:emailId/",authenticateToken, async (request,response)=>{
  const {emailId}=request.params
  const deleteMemberQuery=`
  delete from members where email='${emailId}';
  `;
  await db.run(deleteMemberQuery);
  response.send("Member Deleted Successfully");
})

//post bill api,
app.post("/api/admin/bills/",authenticateToken,async (request,response)=>{
  const newBill=request.body;
  const {
    memberId,amountPaid,method,name
  }=newBill;
  const postBillQuery=`
  insert into bills
  (member_id,amount_paid,method,name)
  values (${memberId},${amountPaid},'${method}','${name}');
  `;
  const dbResponse=await db.run(postBillQuery);
  const billId=dbResponse.lastID;
  response.send(`Bill Successfully added with bill id: ${billId}`)
})

//get bills api
app.get("/api/admin/bills/",authenticateToken, async (request,response)=>{
  const getBillsQuery=`
  select * from bills;
  `;
  const billsArray=await db.all(getBillsQuery);
  response.send(billsArray);
})

//get bills of a member api
app.get("/api/admin/bills/member/:memberId/",authenticateToken, async (request,response)=>{
  const {memberId}=request.params;

  const getBillsOfMemberQuery=`
  select * from bills 
  where member_id='${memberId}'
   order by payment_date desc`;
  const billsArray= await db.all(getBillsOfMemberQuery);
  response.send(billsArray); 
}) 

//get specific bill
app.get("/api/admin/bills/:billId/",authenticateToken, async (request,response )=>{
  const {billId}=request.params;
  const getBillQuery=`
  select * from bills
  where id=${billId};
  `;
  const bill= await db.get(getBillQuery);
  response.send(bill);
})

//add fee package

app.post("/api/admin/packages/",authenticateToken, async (request,response)=>{
  const {
    name,durationDays,amount,description
  }=request.body;

    const postFeePackageQuery=`
    insert into fee_packages
     (name,duration_days,amount,description)
    values ('${name}',${durationDays},${amount},'${description}');
    `; 

  const dbResponse=await db.run(postFeePackageQuery);

  response.send(`Fee Package Created with packageId: ${dbResponse.lastID}`);
} )

//get all fee packages

app.get("/api/admin/packages/",authenticateToken, async (request,response )=>{
  const getFeePackagesQuery=`
  select * from fee_packages
  order by amount asc;
  ` ;
  const feePackagesArray=await db.all(getFeePackagesQuery);
  response.send(feePackagesArray);
})

//get fee package
app.get("/api/admin/packages/:packageId/",authenticateToken, async (request,response )=>{
  const {packageId}=request.params;
  const getFeePackagesQuery=`
  select * from fee_packages
  where id=${packageId};
  ` ;
  const feePackage=await db.get(getFeePackagesQuery);
  response.send(feePackage);
})

//update fee package

app.put("/api/admin/packages/:packageId/",authenticateToken, async (request,response)=>{
  const {packageId}=request.params;
  const {
    name,durationDays,amount,description
  }=request.body;

    const postFeePackageQuery=`
    update fee_packages
    set 
    name='${name}',
    duration_days=${durationDays},
    amount=${amount},
    description='${description}'
    where id=${packageId};
    `; 

  await db.run(postFeePackageQuery);
  response.json({ message: "Fee Package Details Successfully Updated." });
})


//delete package api
app.delete("/api/admin/packages/:packageId/",authenticateToken, async (request,response)=>{
  const {packageId}=request.params;
  const deletePackageQuery=`
  delete from fee_packages
  where id=${packageId};
  `;
  await db.run(deletePackageQuery);
  response.json({ message: "Fee Package Details Successfully Updated." });


})

//post notification api
app.post("/api/admin/notifications/",authenticateToken,async (request,response)=>{
  const {
    title,message,targetType
  }=request.body;
  const postNotificationQuery=`
  insert into notifications
  (title,message,target_type)
  values (?,?,?);
  `;
  const dbResponse=await db.run(postNotificationQuery,[title,message,targetType]);
  response.send(`Notification Created with NotificationId: ${dbResponse.lastID}`);
})


//get notifications api
app.get("/api/admin/notifications/",authenticateToken,async (request,response)=>{
  const getNotificationsQuery=`
  select * from notifications
  order by created_at DESC ;
  `;
  const notificationsArray=await db.all(getNotificationsQuery);
  response.send(notificationsArray);
})

//get notification api
app.get("/api/admin/notifications/:notificationId/",authenticateToken,async (request,response)=>{
  const {notificationId}=request.params;
  const getNotificationsQuery=`
  select * from notifications
  where id=${notificationId};
  `;
  const notification=await db.get(getNotificationsQuery);
  response.send(notification);
})

//delete notification api
app.delete("/api/admin/notifications/:notificationId/",authenticateToken, async (request,response)=>{
  const {notificationId}=request.params;
  const deleteNotificationQuery=`
  delete from notifications
  where id=${notificationId};
  `;
  await db.run(deleteNotificationQuery);
  response.send("Notification Successfully Deleted.");  
})

//post suppliment api
app.post("/api/admin/supplements/",authenticateToken, async (request,response)=>{
  const {
    name,price,description,stockQuantity,url
  }=request.body;
  const postSupplimentQuery=`
  insert into supplements
  (name,price,description,stock_quantity,url)
  values ('${name}',${price},'${description}',${stockQuantity},'${url}')
  `;
  const dbResponse=await db.run(postSupplimentQuery);
  response.send(`Supplement created with id:${dbResponse.lastID}`)
})

//get supplements api
app.get("/api/admin/supplements/",authenticateToken,async (request,response)=>{
  const getSupplementsQuery=`
  select * from supplements;
  `
  const supplementsArray= await db.all(getSupplementsQuery);
  response.send(supplementsArray);
})

//get supplement api
app.get("/api/admin/supplements/:supplementId/",authenticateToken,async (request,response)=>{
  const {supplementId}=request.params;

  const getSupplementsQuery=`
  select * from supplements where id=${supplementId};
  `
  const supplement= await db.get(getSupplementsQuery);
  response.send(supplement);
})

//update supplement api
app.put("/api/admin/supplements/:supplementId/",authenticateToken, async (request,response)=>{
  const {supplementId}=request.params;
  const {
    name,price,description,stockQuantity,url
  }=request.body; 
  const updateSupplementQuery=`
  update supplements
  set 
  name='${name}',
  price=${price},
  description='${description}',
  stock_quantity=${stockQuantity},
  url='${url}'
  where id=${supplementId};

  ` 
  await db.run(updateSupplementQuery);
  response.send("Supplement Successfully updated.");
})

//delete supplement api
app.delete("/api/admin/supplements/:supplementId/",authenticateToken, async (request,response)=>{
  const {supplementId}=request.params;
  const deleteSupplementQuery=`
  delete from supplements
  where id=${supplementId};
  `;
  await db.run(deleteSupplementQuery);
  response.send("Supplement Deleted.");
})

//admin login api
app.post("/api/login/",async (request,response)=>{
  const {email,password,role}=request.body;
  const selectQuery=(role==="admin")?(
    `select * from admins where email='${email}';`
  ) :(
    `select * from members where email='${email}';`
  )
 
  const dbResponse=await db.get(selectQuery);
  if(dbResponse===undefined){
    response.status(400).json({error_msg:"Invalid email."});
  }
  else{
     if(dbResponse.password===null){
      response.status(400).json({error_msg:"Password not set for this user."});
    }
    else{
      const isPasswordMatched= await bcrypt.compare(password,dbResponse.password)
      if(isPasswordMatched===true){
        const payload={
          email:email,
          role:role,
          id:dbResponse.id
        }
        const  jwtToken=jwt.sign(payload,"MY_SECRET_TOKEN");
        response.status(200).json({ jwt_token: jwtToken });
      }
      else{
        response.status(400).json({error_msg:"Invalid Password."})
      }
    } 
  }
})


//reset password api
app.put("/api/reset-password/", async (request,response)=>{
  const {email,password,role}=request.body;
  let selectQuery;
  if(role==='admin'){
    selectQuery=`select * from admins where email='${email}';`;
  }
  else{
    selectQuery=`select * from members where email='${email}';`
  }
  const dbResponse=await db.get(selectQuery);
  if(dbResponse===undefined){
    response.status(400);
    response.send("Invalid email.");
  } 
  else{
    const hashedPassword= await bcrypt.hash(password,10);

    const updatePasswordQuery= (role==='admin')?(
    `
    update admins 
    set 
    password='${hashedPassword}'
    where email='${email}';
    `
    ):(
      `
    update members 
    set 
    password='${hashedPassword}'
    where email='${email}';
    `
    )
    await db.run(updatePasswordQuery);
    response.send("Password updated successfully");
  }

})

//get profile api
app.get("/api/admin/profile", authenticateToken,async(request,response)=>{
  let {email}=request;
  const getAdminDetailsQuery=`
  select * from admins where email='${email}'
  `;
  const adminDetails=await db.get(getAdminDetailsQuery);
  response.send(adminDetails);  
})

// Get all diet plans
app.get("/api/admin/diet-plans", authenticateToken, async (request, response) => {
  try {
    const query = `
      SELECT 
        diet_plans.id, 
        members.email AS member_email, 
        diet_plans.goal, 
        diet_plans.diet_chart, 
        admins.email AS admin_email, 
        diet_plans.created_at
      FROM diet_plans
      JOIN members ON diet_plans.member_id = members.id
      LEFT JOIN admins ON diet_plans.assigned_by = admins.id
    `;
    const result = await db.all(query);
    response.send(result);
  } catch (e) {
    console.error("Error fetching diet plans", e.message);
    response.status(500).send({ error: "Failed to fetch diet plans" });
  }
});


//get diet plan
app.get("/api/admin/diet-plans/:memberId", authenticateToken, async (request, response) => {
  const { memberId } = request.params;
  const getPlanQuery = `
    SELECT * FROM diet_plans WHERE member_id = ${memberId};
  `;
  const plan = await db.get(getPlanQuery);
  response.send(plan);
});

//add diet plan
app.post("/api/admin/diet-plans", authenticateToken, async (request, response) => {
  const { member_email, goal, diet_chart } = request.body;

  const memberQuery = `SELECT id FROM members WHERE email = ?`;
  const member = await db.get(memberQuery, [member_email]);

  if (!member) {
    return response.status(400).send({ error: "Member not found" });
  }

  const adminQuery = `SELECT id FROM admins WHERE email = ?`;
  const admin = await db.get(adminQuery, [request.email]);

  if (!admin) {
    return response.status(400).send({ error: "Admin not found" });
  }

  const insertQuery = `
    INSERT INTO diet_plans (member_id, goal, diet_chart, assigned_by)
    VALUES (?, ?, ?, ?);
  `;

  await db.run(insertQuery, [member.id, goal, diet_chart, admin.id]);
  response.send({ message: "Diet plan added successfully" });
});



//update diet plan
app.put("/api/admin/diet-plans/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { member_id, goal, diet_chart, assigned_by } = request.body;

  const updateQuery = `
    UPDATE diet_plans
    SET 
      member_id = ${member_id},
      goal = '${goal}',
      diet_chart = '${diet_chart}',
      assigned_by = ${assigned_by}
    WHERE id = ${id};
  `;

  await db.run(updateQuery);
  response.send({ message: "Diet plan updated successfully" });
});

//delete diet plan
app.delete("/api/admin/diet-plans/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const deleteQuery = `
    DELETE FROM diet_plans WHERE id = ${id};
  `;
  await db.run(deleteQuery);
  response.send({ message: "Diet plan deleted successfully" });
});


