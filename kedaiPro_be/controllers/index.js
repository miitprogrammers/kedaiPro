const express = require("express");
const re = express.Router();
const auth = require("./authCont");

re.post("/login", auth.login);
re.post("/utildata", auth.utildata);
re.post("/setprofile", auth.setProfile);
re.post("/newrole", auth.newRole);
re.post("/deleterole", auth.deleteRole);
re.post("/updateakses", auth.updateAkses);
re.post("/newuser", auth.addAccount);
re.post("/getusers", auth.getUsers);
re.post("/edituser", auth.editUser);
re.post("/deleteuser", auth.deleteUser);
re.post("/refreshdata", auth.refreshData);

module.exports = re;
