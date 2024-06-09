'use client'

import { useContext, useMemo } from 'react'
import Link from 'next/link'
import { AccountContext } from '@/contexts/AccountContext'
import { Node } from 'reactflow'
import { z } from 'zod'

import {
  ServiceFromName,
  TemplateFromId,
  TemplateGetSpecs,
  type DeploymentTemplate,
} from '@/types/dataProvider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Section } from '@/components/ui/section'
import ReviewYourBuild from '@/components/FinalBuild'
import { Icons } from '@/components/Icons'
import Signup from '@/components/Signup'

import DeploymentTemplatePage from './deployment-overview'
import DeploymentProvider from './deployment-provider'
import DeploymentProgress from './progress-sidebar'

type DeployPageProps = {
  searchParams: {
    tId: string
    workspace: string
  }
}
export default function DeployPage({ searchParams }: DeployPageProps) {
  const { indexerDeployerStep } = useContext(AccountContext)

  const tId = z.string().optional().parse(searchParams.tId)

  const workspace = z.coerce
    .boolean()
    .optional()
    .parse(Number(searchParams.workspace))

  const templateData: DeploymentTemplate | null = useMemo(() => {
    if (tId) {
      const template = TemplateFromId(tId)
      const services = template.serviceNames
        .map((service) => ServiceFromName(service))
        .filter(Boolean)

      const specs = TemplateGetSpecs(template)
      return {
        name: template.name,
        description: template.desc,
        tags: template.tags,
        minSpecs: specs,
        services: services?.map((service) => ({
          name: service.name,
          description: service.desc,
          tags: service.tags,
          nixName: service.nixName,
        })),
      } satisfies DeploymentTemplate
    }
    if (workspace) {
      const nodes: Node[] = JSON.parse(localStorage.getItem('nodes'))
      return {
        custom: true,
        name: 'Custom Build',
        description: 'Based on your design',
        services: nodes
          .filter(({ type }) => type !== 'server')
          .flatMap((node) => {
            if (node.data.lists?.length) {
              return node.data.lists.map((item) => {
                return {
                  name: item.title,
                  description: '-',
                  tags: [node.type],
                  nixName: '-',
                }
              })
            } else {
              return {
                name: node.data.name,
                description: '-',
                tags: [node.type],
                nixName: '-',
              }
            }
          }),
      } satisfies DeploymentTemplate
    }
    return null
  }, [tId, workspace])

  return (
    <div className="flex h-full">
      {templateData ? (
        <Section className="my-20 flex-1">
          {indexerDeployerStep === -1 ? (
            <DeploymentTemplatePage {...templateData} />
          ) : null}
          {indexerDeployerStep === 0 ? (
            <DeploymentProvider specs={templateData.minSpecs} />
          ) : null}
          {indexerDeployerStep === 1 ? <Signup /> : null}
          {indexerDeployerStep === 2 ? <ReviewYourBuild /> : null}
        </Section>
      ) : (
        <>
          <span className="flex-1" />
          <Dialog open>
            <DialogContent canClose={false}>
              <DialogHeader>
                <DialogTitle>Template not found.</DialogTitle>
                <DialogDescription>
                  Please go back and select a valid template.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4">
                <Link
                  href="/templates"
                  className="flex flex-1 items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
                >
                  <Icons.Templates className="size-6" />
                  <span className="text-lg font-medium">Templates</span>
                </Link>
                <Link
                  href="/workspace"
                  className="flex flex-1 items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
                >
                  <Icons.DesignAndBuildIcon className="size-6" />
                  <span className="text-lg font-medium">Design & Build</span>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      <DeploymentProgress />
    </div>
  )
}