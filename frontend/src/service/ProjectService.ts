import meEndpoint from 'src/api/meEndpoint';
import projectEndpoint from 'src/api/projectEndpoint';
import uploadEndpoint from 'src/api/uploadEndpoint';
import { GetProjectResponse, PutProjectRequest } from 'src/model/backend/api/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { file2Base64 } from 'src/util/fileConverter';
import { loadProjects } from './OverallService';
import { updateLastProjectId } from './UploadService';

export const getProject = async (projectId?: string): Promise<DetailedProject | null> => {
  try {
    dispatch(startWaiting());

    const {
      api: { projects },
      me: { lastProjectId },
    } = getState();
    let myProjects: GetProjectResponse;

    if (projects !== undefined) myProjects = projects;
    else myProjects = await loadProjects();

    if (myProjects.length === 0) return null;

    // save and return specific project accordingly
    if (projectId) {
      const requiredProject = myProjects.find((v) => v.id === projectId);
      if (requiredProject) {
        if (lastProjectId !== projectId) await updateLastProjectId(projectId);

        return requiredProject;
      }
    }

    // return project saved in redux
    if (lastProjectId) {
      const requiredProject = myProjects.find((v) => v.id === lastProjectId);
      if (requiredProject) return requiredProject;
    }

    // return project saved in db for newly refresh page
    const res = await meEndpoint.getMe();
    const latestProjectId = res.data.lastProjectId;
    if (latestProjectId) {
      const requiredProject = myProjects.find((v) => v.id === latestProjectId);
      if (requiredProject) return requiredProject;
    }

    // save and return first project if none of above satisfies
    await updateLastProjectId(myProjects[0].id);

    return myProjects[0];
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateProject = async (id: string, data: PutProjectRequest) => {
  try {
    dispatch(startWaiting());
    await projectEndpoint.putProject(id, data);
    const projects = await loadProjects();

    return projects.find((v) => v.id === id);
  } finally {
    dispatch(finishWaiting());
  }
};

export const setApproval = async (projectId: string, creationId: string) => {
  try {
    dispatch(startWaiting());
    await projectEndpoint.putProjectIdApprovalCid(projectId, creationId);
    const projects = await loadProjects();

    return projects.find((v) => v.id === projectId);
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateCover = async (project: DetailedProject, coverFile: File) => {
  try {
    dispatch(startWaiting());
    if (project.mainLyrics)
      await uploadEndpoint.putUploadIdCover(project.mainLyrics.id, {
        file: await file2Base64(coverFile),
      });
    if (project.mainTrack)
      await uploadEndpoint.putUploadIdCover(project.mainTrack.id, {
        file: await file2Base64(coverFile),
      });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateTrack = async (
  trackId: string,
  files: {
    track: File;
    tab: File | null;
  },
) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.putUploadId(trackId, {
      type: 'track',
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const updateLyrics = async (lyricsId: string, lyrics: string) => {
  try {
    dispatch(startWaiting());
    await uploadEndpoint.putUploadId(lyricsId, {
      type: 'lyrics',
      lyrics,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadTrack = async (projectId: string, files: { track: File; tab: File | null }) => {
  try {
    dispatch(startWaiting());
    await projectEndpoint.postProjectIdOriginal(projectId, {
      type: 'track',
      file: await file2Base64(files.track),
      tabFile: files.tab ? await file2Base64(files.tab) : null,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const uploadLyrics = async (projectId: string, lyrics: string) => {
  try {
    dispatch(startWaiting());
    await projectEndpoint.postProjectIdOriginal(projectId, {
      type: 'lyrics',
      lyrics,
    });

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};

export const startProject = async (id: string) => {
  try {
    dispatch(startWaiting());
    await projectEndpoint.postProjectIdStart(id);

    await loadProjects();
  } finally {
    dispatch(finishWaiting());
  }
};
