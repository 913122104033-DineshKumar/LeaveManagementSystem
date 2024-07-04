import Department from '../models/department.model.js';
import Batch from '../models/batch.model.js';
import Section from '../models/section.model.js';
import Staff from '../models/staff.model.js';

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('batches');
    res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentIdByName = async (req, res, next) => {
  const { departmentName } = req.params;
  try {
    const department = await Department.findOne({ dept_name: departmentName });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ departmentId: department._id });
  } catch (error) {
    console.error('Error fetching department:', error);
    next(error); 
  }
};

export const getBatches = async (req, res, next) => {
  const { departmentId } = req.params;
  try {
    const department = await Department.findById(departmentId).populate('batches');
    res.status(200).json(department.batches);
  } catch (error) {
    next(error);
  }
};


export const getSections = async (req, res, next) => {
  const { batchId } = req.params;
  try {
    const batch = await Batch.findById(batchId).populate('sections');
    res.status(200).json(batch.sections);
  } catch (error) {
    next(error);
  }
};

export const getSectionIdByBatchAndName = async (req, res) => {
  const { batchId, sectionName } = req.params;
  try {
    const section = await Section.findOne({ section_name: sectionName, batch: batchId });
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    // Extract just the section ID
    const { _id } = section;
    // Send back only the section ID
    res.json({ sectionId: _id });
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMentors = async (req, res, next) => {
  const { sectionId } = req.params;
  try {
    const mentors = await Staff.find({ staff_role: 'Mentor', staff_handle_section: sectionId });
    res.status(200).json(mentors);
  } catch (error) {
    next(error);
  }
};

export const getClassIncharges = async (req, res, next) => {
  const { sectionId } = req.params;
  try {
    const classIncharges = await Staff.find({ staff_role: 'ClassIncharge', staff_handle_section: sectionId });
    res.status(200).json(classIncharges);
  } catch (error) {
    next(error);
  }
};
