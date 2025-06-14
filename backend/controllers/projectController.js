import Project from '../models/Project.js';
import User from '../models/User.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, requirements, skills, duration } = req.body;
    const employer_id = req.user.id; // Get from authenticated user

    // Verify user is an employer
    const user = await User.findByPk(employer_id);
    if (!user || user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can create projects' });
    }

    const project = await Project.create({
      title,
      description,
      requirements,
      skills: Array.isArray(skills) ? skills : [skills],
      duration,
      employer_id
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: User,
        as: 'employer',
        attributes: ['id', 'name', 'company_name']
      }],
      order: [['created_at', 'DESC']]
    });

    // Transform the response to ensure skills is always an array
    const transformedProjects = projects.map(project => ({
      ...project.toJSON(),
      skills: Array.isArray(project.skills) ? project.skills : []
    }));

    res.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [{
        model: User,
        as: 'employer',
        attributes: ['id', 'name', 'company_name', 'company_description']
      }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Transform the response to ensure skills is always an array
    const transformedProject = {
      ...project.toJSON(),
      skills: Array.isArray(project.skills) ? project.skills : []
    };

    res.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Update project status
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employer_id = req.user.id;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify user is the project owner
    if (project.employer_id !== employer_id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Validate status
    if (!['open', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await project.update({ status });

    res.json({
      message: 'Project status updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Error updating project status', error: error.message });
  }
}; 