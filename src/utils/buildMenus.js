function buildMenuTree(pages) {
  const modules = {};

  pages.forEach(page => {
    const module = page.moduleId;
    const subModule = page.subModuleId;

    const moduleId = module._id.toString();
    const subModuleId = subModule._id.toString();

    // MODULE
    if (!modules[moduleId]) {
      modules[moduleId] = {
        _id: moduleId,
        name: module.name,
        icon: module.icon,
        menuRank: module.menuRank,
        url: module.url || null,
        subModules: {}
      };
    }

    // SUB MODULE
    if (!modules[moduleId].subModules[subModuleId]) {
      modules[moduleId].subModules[subModuleId] = {
        _id: subModuleId,
        name: subModule.name,
        icon: subModule.icon,
        menuRank: subModule.menuRank,
        url: subModule.url || null,
        pages: []
      };
    }

    // PAGE
    modules[moduleId].subModules[subModuleId].pages.push({
      _id: page._id,
      name: page.name,
      icon: page.icon,
      url: page.url,
      menuRank: page.menuRank
    });
  });

  // Convert object → array and sort everything by menuRank
  return Object.values(modules)
    .sort((a, b) => a.menuRank - b.menuRank)
    .map(module => ({
      ...module,
      subModules: Object.values(module.subModules)
        .sort((a, b) => a.menuRank - b.menuRank)
        .map(sub => ({
          ...sub,
          pages: sub.pages.sort((a, b) => a.menuRank - b.menuRank)
        }))
    }));
}

module.exports = { buildMenuTree };
