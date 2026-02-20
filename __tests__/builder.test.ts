import { generateGitHubActionsWorkflow } from '@/lib/builder';

describe('generateGitHubActionsWorkflow', () => {
  it('generates Android-only workflow', () => {
    const workflow = generateGitHubActionsWorkflow('react-native', 'android');
    expect(workflow).toContain('build-android');
    expect(workflow).toContain('assembleRelease');
    expect(workflow).not.toContain('build-ios');
  });

  it('generates iOS-only workflow', () => {
    const workflow = generateGitHubActionsWorkflow('react-native', 'ios');
    expect(workflow).toContain('build-ios');
    expect(workflow).not.toContain('build-android');
  });

  it('generates both-platform workflow', () => {
    const workflow = generateGitHubActionsWorkflow('react-native', 'both');
    expect(workflow).toContain('build-android');
    expect(workflow).toContain('build-ios');
  });

  it('generates Flutter workflow', () => {
    const workflow = generateGitHubActionsWorkflow('flutter', 'both');
    expect(workflow).toContain('flutter-action');
    expect(workflow).toContain('flutter build apk');
    expect(workflow).toContain('flutter build ios');
  });

  it('includes workflow_dispatch trigger', () => {
    const workflow = generateGitHubActionsWorkflow('android', 'android');
    expect(workflow).toContain('workflow_dispatch');
  });
});
