import Report from "../models/Report.js";

/* ================================
   @desc Create new report
================================ */
export const createReport = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address } = req.body;

    const imagePath = req.file ? req.file.path : null;

    const report = new Report({
      title,
      description,
      category,
      location: { latitude, longitude, address },
      reporter: req.user._id,
      imagePath: imagePath || null
    });

    const saved = await report.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================================
   @desc Get all reports
================================ */
export const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = category ? { category } : {};

    const reports = await Report.find(query)
      .populate("reporter", "name email")
      .populate("comments.user", "name")   // 👈 populate comment user
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Report.countDocuments(query);

    res.json({ total, page: Number(page), limit: Number(limit), reports });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================================
   @desc Get single report
================================ */
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name email")
      .populate("comments.user", "name");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================================
   @desc Update status (admin only)
================================ */
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    await report.save();

    res.json(report);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================================
   @desc Add comment to report
================================ */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const newComment = {
      user: req.user._id,
      text
    };

    report.comments.push(newComment);
    await report.save();

    // return updated comments with username
    const updatedReport = await Report.findById(req.params.id)
      .populate("comments.user", "name");

    res.json(updatedReport.comments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
