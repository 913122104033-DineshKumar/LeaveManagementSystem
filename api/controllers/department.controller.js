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
    const mentors = await Staff.find({ isMentor: true,'mentorHandlingData.handlingSectionId': sectionId});
    res.status(200).json(mentors);
  } catch (error) {
    next(error);
  }
};

export const getClassIncharges = async (req, res, next) => {
  const { sectionId } = req.params;
  try {
    const classIncharges = await Staff.find({ isClassIncharge: true,classInchargeSectionId : sectionId });
    res.status(200).json(classIncharges);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate({
      path: 'batches',
      populate: { path: 'sections', model: 'Section' }
    });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).populate('sections');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSectionNameById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a URL parameter
    const section = await Section.findById(id); // Fetch section by ID
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.status(200).json({ name: section.section_name }); // Respond with section name
  } catch (error) {
    console.error('Error fetching section name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDepartmentNameByCurrentUserId = async (req, res, next) => {
  const { deptId } = req.query;
  try {
    const response = await Department.findById(deptId).populate('batches');
    if(!response) {
      return res.status(400).json({ error : 'DepartMent not Found' });
    }
    res.status(200).json({ name : response.dept_name });
  } catch (error) {
    next(error);
  }
};

//To delete Mentor 
export const deleteMentor = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const mentor = await Staff.findByIdAndDelete(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

//To delete Class Incharge
export const deleteClassIncharge = async (req, res) => {
  const { inchargeId } = req.params;
  try {
    const classIncharge = await Staff.findByIdAndDelete(inchargeId);
    if (!classIncharge) {
      return res.status(404).json({ message: 'ClassIncharge not found' });
    }
    res.json({ message: 'ClassIncharge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

//To add Section

export const addSection = async (req, res) => {
  console.log('Entered addSection');
  const { batchId, section_name } = req.body;
  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    const section = new Section({ section_name, Batch:batchId });
    await section.save();
    batch.sections.push(section._id);
    await batch.save();
    res.status(201).json(section);
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//To Add Department
export const addDepartment = async(req,res) =>{
  const ignoreWords = ["and", "of", "the", "for", "with", "on", "in", "at", "by"]; // Add more words to ignore as needed
  console.log('Entered addDepartment');
  const { dept_name } = req.body;
  console.log(dept_name);
  const dept_acronym = dept_name.split(' ').filter(word => !ignoreWords.includes(word.toLowerCase())).map(word => word[0]).join('').toUpperCase();
  console.log(dept_acronym);
  const dept_head = null;
  try {
    const department = new Department({ dept_name , dept_acronym, dept_head });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export const deleteSection = async(req, res) => {
  const { sectionId } = req.params;
  try {
    const section = await Section.findByIdAndDelete(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    const batch = await Batch.findByIdAndUpdate(section.Batch, { $pull: { sections: sectionId } }, { new: true });
    if (!batch) { 
      return res.status(500).json({ message: 'Failed to update batch' });
    }
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

//To add a new Batch
export const addNewBatch = async (req, res) => {
  console.log('Entered adding new batch');
  const { dept_id, batch_name } = req.body;
  console.log(dept_id);
  console.log(batch_name);
  
  try {
    // Create a new Batch document
    const newBatch = new Batch({ batch_name, department: dept_id }); // Ensure department field name matches your schema
    await newBatch.save();

    // Get the ID of the newly created batch
    const batchId = newBatch._id;

    // Update the Department document with the new batch ID
    const department = await Department.findById(dept_id);

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Update department with the new batch ID
    department.batches.push(batchId); // Assuming batches is an array in Department model
    await department.save();

    // Return success response with the newly created batch
    res.status(201).json(newBatch);
  } catch (error) {
    console.error('Error adding new batch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//to delete a batch
export const deleteBatch = async(req,res)=>{
  console.log('Entered deleteBatch');
  try{
    const { batchId } = req.params;
    const batch = await Batch.findByIdAndDelete(batchId);
    if(!batch){
      return res.status(404).json({ message: 'Batch not found' });
    }
    const department = await Department.findByIdAndUpdate(batch.department, { $pull: { batches: batchId } }, { new: true });
    if(!department){
      return res.status(500).json({ message: 'Failed to update department' });
    }
    res.json({ message: 'Batch deleted successfully' });
  }
  catch(error)
  {
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteDepartment = async(req,res)=>{
  console.log('Entered deleteDepartment');
  try{
    const { deptId } = req.params;
    const department = await Department.findByIdAndDelete(deptId);
    if(!department){
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully' });
  }
  catch(error)
  {
    res.status(500).json({ message: 'Server error' });
  }
}