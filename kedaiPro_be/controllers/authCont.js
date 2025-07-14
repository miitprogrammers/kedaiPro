const Crud = require("../helpers/crud");
const cry = require("../helpers/crypter");

module.exports = {
  createPass: async (req, res) => {
    const { pass } = req.body;
    const hashed = cry.encryptText(pass);
    res.send(hashed);
  },
  login: async (req, res) => {
    try {
      const data = req.body;
      const { userId, userPassword } = data;
      const db = new Crud();
      db.join("left", "role_table", "role_table.roleID", "user_table.userRole");
      db.where("userId", "=", userId);
      const dupe = await db.get("user_table");

      if (dupe < 1)
        throw {
          icon: "error",
          text: "Akun tidak dikenal, silahkan masukan userId anda.",
          title: "Akun Tidak dikenal",
        };

      const hash = dupe[0].userPassword;
      const decrypted = cry.decryptText(hash);

      if (decrypted != userPassword)
        throw {
          icon: "error",
          text: "Kata sandi anda tidak dikenal, silahkan login kembali.",
          title: "Kata Sandi Salah",
        };

      const db2 = new Crud();
      const prof = await db2.get("profil_table");

      return res.status(200).json({ dupe, prof });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  refreshData: async (req, res) => {
    const data = req.body;
    const { userId } = data;
    const db = new Crud();
    db.join("left", "role_table", "role_table.roleID", "user_table.userRole");
    db.where("userId", "=", userId);
    const dupe = await db.get("user_table");
    const db2 = new Crud();
    const prof = await db2.get("profil_table");

    return res.status(200).json({ dupe, prof });
  },
  utildata: async (req, res) => {
    try {
      const db = new Crud();
      const db2 = new Crud();
      const db3 = new Crud();
      const prov = await db.get("provinsi");
      let roles = await db2.get("role_table");
      roles = await Promise.all(
        roles.map((role) => {
          role.hakAkses = JSON.parse(role.hakAkses);
          return role;
        })
      );
      const city = await db3.get("kota");
      return res.status(200).json({ prov, role: roles, city });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  setProfile: async (req, res) => {
    try {
      const data = req.body;
      const db = new Crud();
      await db.update("profil_table", data);
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  newRole: async (req, res) => {
    try {
      let data = req.body;
      const { roleName, roleID, homePage } = data;
      if (!roleID) {
        data.hakAkses = JSON.stringify([homePage]);
        const db = new Crud();
        const db2 = new Crud();
        db2.where("roleName", "=", roleName);
        const dupe = await db2.get("role_table");
        if (dupe.length > 0)
          throw {
            icon: "error",
            text: "Nama role sudah digunakan, silakan gunakan nama lain.",
          };
        await db.insert("role_table", data);
      } else {
        const db = new Crud();
        const db2 = new Crud();
        const db3 = new Crud();
        db2.where("roleName", "=", roleName);
        db2.where("roleID", "!=", roleID);
        const dupe = await db2.get("role_table");
        if (dupe.length > 0)
          throw {
            icon: "error",
            text: "Nama role sudah digunakan, silakan gunakan nama lain.",
          };

        db3.where("roleID", "=", roleID);
        const current = await db3.get("role_table");
        let hakAkses = JSON.parse(current[0].hakAkses);
        if (!hakAkses.includes(homePage)) {
          hakAkses.push(homePage);
        }
        data.hakAkses = JSON.stringify(hakAkses);

        db.where("roleID", "=", roleID);
        await db.update("role_table", data);
      }
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  deleteRole: async (req, res) => {
    try {
      const data = req.body;
      const { roleID } = data;
      const db = new Crud();
      db.where("roleID", "=", roleID);
      await db.delete("role_table");
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  updateAkses: async (req, res) => {
    try {
      const data = req.body;
      const { roleID, hakAkses } = data;
      const db = new Crud();
      db.where("roleID", "=", roleID);
      await db.update("role_table", { hakAkses });
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  addAccount: async (req, res) => {
    try {
      let data = req.body;
      const { userWhatsapp, userId } = data;
      const db = new Crud();
      const db2 = new Crud();
      db.where("userWhatsapp", "=", userWhatsapp);
      const dupe = await db.get("user_table");

      if (dupe.length > 0)
        throw {
          text: "Nomor telpon telah digunakan, silahkan gunakan nomor lain.",
          icon: "error",
        };

      db2.where("userId", "like", `%${userId}%`);
      const code = await db2.get("user_table");
      data.userId = `${data.userId}-${code.length + 1}`;
      data.userPassword = cry.encryptText(data.userPassword);
      delete data.confPassword;
      await new Crud().insert("user_table", data);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  getUsers: async (req, res) => {
    try {
      const db = new Crud();
      db.select("userName, userRole,userId,userWhatsapp,roleName");

      db.join("left", "role_table", "role_table.roleID", "user_table.userRole");
      const users = await db.get("user_table");
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  editUser: async (req, res) => {
    try {
      let data = req.body;
      const { userId, userWhatsapp, userPassword } = data;
      delete data.confPassword;
      const db = new Crud();
      db.where("userWhatsapp", "=", userWhatsapp);
      db.where("userId", "!=", userId);
      const dupe = await db.get("user_table");
      if (dupe.length > 0)
        throw {
          icon: "error",
          text: "Nomor telpon sudah digunakan oleh akun lain, silahkan gunakan nomor lain.",
        };

      if (data.userPassword != "") {
        data.userPassword = cry.encryptText(data.userPassword);
      } else {
        delete data.userPassword;
      }

      const db2 = new Crud();
      db2.where("userId", "=", userId);
      await db2.update("user_table", data);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  },
  deleteUser: async (req, res) => {
    const { userId } = req.body;
    const db = new Crud();
    db.where("userId", "=", userId);
    await db.delete("user_table");
    return res.status(200).json({ userId });
  },
};
