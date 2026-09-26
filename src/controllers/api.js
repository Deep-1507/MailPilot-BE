import API from "../models/apiKeysModel.js";


export const getApi = async (req, res) => {
  try {
    const apidetails = await API.findById(req.body.apiKeyId);

    if (!apidetails) {
        return res.status(404).json({ message: "API KEY not found" });
      }
  

    if(apidetails.userId != req.userId) {
        return res.status(403).json({message:"Unauthorized"})
    }

    
    res.status(200).json(apidetails);
  } catch (error) {
    console.error("Error fetching API KEY:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAPI = async (req, res) => {
  try {
    const apis = await API.find(); // Exclude password
    res.status(200).json(apis);
  } catch (error) {
    console.error("Error fetching apis:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteAPIKey = async (req, res) => {
  try {
    let deletedAPIKey;

    deletedAPIKey = await API.findByIdAndDelete(req.params.id);

    if (deletedAPIKey.length==0) {
      return res.status(404).json({ message: "API KEY not found" });
    }

    res.status(200).json({ message: "API KEY deleted successfully" });
  } catch (error) {
    console.error("Error deleting API Key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};