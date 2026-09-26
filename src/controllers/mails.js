import sentMails from "../models/sentMailDataModel.js";


export const getSentMailsHsitory = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
 
    const mails = await sentMails.find({ userId: req.userId });
    console.log(mails)

    if (!mails || mails.length === 0) {
      return res.status(404).json({ message: "No mails found" });
    }

    res.status(200).json(mails);
  } catch (error) {
    console.error("Error fetching mails:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSentMailsHsitoryByAdmin = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
    }
 
    const mails = await sentMails.find({ userId: req.params.id });

    if (!mails || mails.length === 0) {
      return res.status(404).json({ message: "No mails found" });
    }

    res.status(200).json(mails);
  } catch (error) {
    console.error("Error fetching mails:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSentMailsHsitoryByAdmin = async (req, res) => {
  try {
    if (!req.adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin ID missing" });
    }
 
    const mails = await sentMails.find();

    if (!mails || mails.length === 0) {
      return res.status(404).json({ message: "No mails found" });
    }

    res.status(200).json(mails);
  } catch (error) {
    console.error("Error fetching mails:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getCredById = async (req, res) => {
  try {
    const cred = await Cred.findById(req.params.id);

    if (!cred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json(cred);
  } catch (error) {
    console.error("Error fetching credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCred = async (req, res) => {
  try {
    const updatedCred = await Cred.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedCred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json({
      message: "Credential updated successfully",
      cred: updatedCred,
    });
  } catch (error) {
    console.error("Error updating credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCred = async (req, res) => {
  try {
    const deletedCred = await Cred.findByIdAndDelete(req.params.id);

    if (!deletedCred) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json({ message: "Credential deleted successfully" });
  } catch (error) {
    console.error("Error deleting credential:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
